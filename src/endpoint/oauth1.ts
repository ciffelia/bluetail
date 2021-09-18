import { OAuthEndpoint } from './OAuthEndpoint'

const oauth1 = {
  getRequestToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth/request_token'
  }),
  authenticate: new OAuthEndpoint({
    method: 'GET',
    path: 'oauth/authenticate'
  }),
  authorize: new OAuthEndpoint({
    method: 'GET',
    path: 'oauth/authorize'
  }),
  getAccessToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth/access_token'
  }),
  invalidateAccessToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth/invalidate_token'
  })
} as const

export { oauth1 }
