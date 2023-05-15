import * as TodosAccess from '../data/todosAcess'
import { AttachmentUtils } from '../../helpers/attachmentUtils'
import { TodoItem } from '../../models/TodoItem'
import { TodoUpdate } from '../../models/TodoUpdate'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
// const todosAccess = new TodosAccess

// Get todo function
export const getTodos = async (userId: string) => {
  logger.info('Get todos for user function called.')
  return await TodosAccess.getAllTodos(userId)
}

// Create todo function
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Create todo function called')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const newItem: TodoItem = {
    userId: userId,
    todoId: todoId,
    name: newTodo.name,
    createdAt: createdAt,
    done: false,
    attachmentUrl: null,
    dueDate: newTodo.dueDate
  }
  await TodosAccess.createTodo(newItem)
  return newItem
}

// Update todo function
export async function updateTodo(
  userId: string,
  todoId: string,
  todoUpdate: UpdateTodoRequest
): Promise<TodoUpdate> {
  logger.info('Update todo function called')
  return await TodosAccess.updateTodo(userId, todoId, todoUpdate)
}

// Delete todo function
export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<string> {
  logger.info('Delete todo function called')
  return await TodosAccess.deleteTodo(userId, todoId)
}

// Create attachment function
export async function createAttachmentPresignedUrl(
  userId: string,
  todoId: string
) {
  logger.info('Create attachment function called')
  TodosAccess.updateTodoAttachmentUrl(userId, todoId)
  return attachmentUtils.getUploadUrl(todoId)
}

// Pagination todo function
export async function getTodosWithPagination(
  userId: string,
  nextKey: JSON,
  limit: number
) {
  logger.info('Pagination todo function called')
  return await TodosAccess.TodosPaging(userId, nextKey, limit)
}

// Search todo function
export async function searchTodo(userId: string, searchValue: string): Promise<TodoItem[]> {
  logger.info('Search todos for user function called.')
  return await TodosAccess.SearchTodo(userId, searchValue)
}