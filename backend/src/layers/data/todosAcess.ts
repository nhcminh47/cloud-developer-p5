import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()

const TODOS_TABLE = process.env.TODOS_TABLE || "";
const ATTACHMENT_S3_BUCKET = process.env.ATTACHMENT_S3_BUCKET || "";
const SIGNED_URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION || "";
const INDEX_NAME = process.env.INDEX_NAME
// TODO: Implement the dataLayer logic
export const getAllTodos = async (userId: string) => {
  logger.info('get all todos data')
  const todos = await docClient.query({
    TableName: TODOS_TABLE,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: { '#userId': 'userId', '#_name': 'name' },
    ExpressionAttributeValues: { ':userId': userId },
    ProjectionExpression: 'todoId, userId, createdAt, #_name, dueDate, done, attachmentUrl',
  }).promise();
  return todos.Items || [];
};

export const createTodo = async (todo: TodoItem) => {
  const newTodo: TodoItem = {
    userId: todo.userId,
    todoId: todo.todoId,
    createdAt: new Date().toDateString(),
    name: todo.name,
    dueDate: todo.dueDate,
    done: false,
    attachmentUrl: ""
  }
  await docClient.put({
    TableName: TODOS_TABLE,
    Item: newTodo,
  }).promise();
};

export const updateTodo = async (userId: string, todoId: string, todo: UpdateTodoRequest) => {
  await docClient.update({
    TableName: TODOS_TABLE,
    Key: {
      todoId,
      userId,
    },
    UpdateExpression: 'set #_name = :name, #dueDate = :dueDate, #done = :done',
    ExpressionAttributeNames: {
      '#_name': 'name',
      '#dueDate': 'dueDate',
      '#done': 'done',
    },
    ExpressionAttributeValues: {
      ':name': todo.name,
      ':dueDate': todo.dueDate,
      ':done': todo.done,
    },
  }).promise();
  return todo
}

export const deleteTodo = async (userId: string, todoId: string) => {
  await docClient.delete({
    TableName: TODOS_TABLE,
    Key: {
      userId,
      todoId,
    },
  }).promise();
  return todoId
};

export const updateTodoAttachmentUrl = async (userId: string, todoId: string): Promise<string> => {
  const presignedUrl = new AWS.S3({
    signatureVersion: 'v4',
  }).getSignedUrl('putObject', {
    Bucket: ATTACHMENT_S3_BUCKET,
    Key: `${todoId}.jpg`,
    Expires: parseInt(SIGNED_URL_EXPIRATION),
  });


  await docClient.update({
    TableName: TODOS_TABLE,
    Key: {
      userId,
      todoId,
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}.jpg`,
    },
  }).promise();

  return presignedUrl;
};

export const TodosPaging = async (userId: string, nextKey: JSON, limit: number): Promise<{ itemList: TodoItem[], nextKey: any }> => {
  const res = await docClient.query({
    TableName: TODOS_TABLE,
    Limit: limit,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ExclusiveStartKey: nextKey,
    ScanIndexForward: false
  }).promise()
  const itemList = res.Items as TodoItem[];
  return { itemList, nextKey: res.LastEvaluatedKey }
}

export const SearchTodo = async (userId: string, searchValue: string): Promise<TodoItem[]> => {
  const res = await docClient.query({
    TableName: TODOS_TABLE,
    IndexName: INDEX_NAME,
    KeyConditionExpression: 'userId = :userId',
    FilterExpression: 'contains (#name,:searchValue)',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':searchValue': searchValue
    }
  }).promise()
  const itemList = res.Items;
  return itemList as TodoItem[]
}