import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../layers/businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from "../../utils/logger";

const logger = createLogger('deleteTodo');
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters?.todoId || ""
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)

    try {
      const deleteData = await deleteTodo(userId, todoId)
      logger.info("Delete Todo", deleteData)
      return {
        statusCode: 200,
        body: deleteData
      }
    }
    catch (e) {
      logger.error('Error deleting todo', e);
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)