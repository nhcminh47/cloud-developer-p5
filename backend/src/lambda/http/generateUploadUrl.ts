import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../layers/businessLogic/todos'
import { getUserId } from '../utils'

import { createLogger } from "../../utils/logger";

const logger = createLogger('generateAttachmentURL');
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters?.todoId || ""
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)
    
    try {
      const url = await createAttachmentPresignedUrl(userId, todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
    }
    catch(e) {
      logger.error('Error generating Attachment URL', e);
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