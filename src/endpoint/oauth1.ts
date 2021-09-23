import { OAuthEndpoint } from './OAuthEndpoint'

/**
 * OAuth 1.0a API endpoints
 *
 * @see {@link https://developer.twitter.com/en/docs/authentication/oauth-1-0a}
 */
const oauth1 = {
  /**
   * `POST oauth/request_token` endpoint
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/request_token}
   */
  getRequestToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth/request_token'
  }),

  /**
   * `GET oauth/authenticate` endpoint
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/authenticate}
   */
  authenticate: new OAuthEndpoint({
    method: 'GET',
    path: 'oauth/authenticate'
  }),

  /**
   * `GET oauth/authorize` endpoint
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/authorize}
   */
  authorize: new OAuthEndpoint({
    method: 'GET',
    path: 'oauth/authorize'
  }),

  /**
   * `POST oauth/access_token` endpoint
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/access_token}
   */
  getAccessToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth/access_token'
  }),

  /**
   * `POST oauth/invalidate_token` endpoint
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/invalidate_access_token}
   */
  invalidateAccessToken: new OAuthEndpoint({
    method: 'POST',
    path: '1.1/oauth/invalidate_token'
  })
} as const

export { oauth1 }
