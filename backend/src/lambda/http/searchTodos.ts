import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { searchTodo } from '../../layers/businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const searchValue: string = JSON.parse(event.body ? event.body : "")?.searchValue
        // TODO: search todos item by string value
        const userId = getUserId(event)
        const items = await searchTodo(userId, searchValue)
        return {
            statusCode: 200,
            body: JSON.stringify({
                items
            })
        }
    }
)

handler.use(httpErrorHandler()).use(
    cors({
        credentials: true
    })
)