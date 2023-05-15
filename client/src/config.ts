// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ek6j8kc41f'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-kl3n3eobzh3fvxku.us.auth0.com',            // Auth0 domain
  clientId: 'Xf0xYNaHOOvL1jGdBhfl2HZRvHbPCz5B',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

export const limitPagination = 2