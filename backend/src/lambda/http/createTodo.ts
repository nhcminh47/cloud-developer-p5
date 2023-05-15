import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../layers/businessLogic/todos'
import { createLogger } from "../../utils/logger";

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body ? event.body : "");
      // TODO: Implement creating a new TODO item
      const userId = getUserId(event)
      const newItem = await createTodo(newTodo, userId)
      logger.info('New todo', newItem);
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    }
    catch (e) { 
      logger.error('Error creating todo', e);
      return  {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Todo Name is not null'
        })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)