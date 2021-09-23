import { OAuthEndpoint } from './OAuthEndpoint'

/**
 * OAuth 2.0 API endpoints
 *
 * @see {@link https://developer.twitter.com/en/docs/authentication/oauth-2-0}
 */
const oauth2 = {
  /**
   * `POST oauth2/token` endpoint
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/token}
   */
  getBearerToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth2/token',
    payloadType: 'UrlEncodedForm'
  }),

  /**
   * `POST oauth2/invalidate_token` endpoint
   *
   * Note: According to Twitter Developers Forum, this API seems to be broken since 2019.
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/invalidate_bearer_token}
   * @see {@link https://twittercommunity.com/t/oauth2-invalidate-token-not-working-with-sorry-that-page-does-not-exist-code-34-error/120646}
   */
  invalidateBearerToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth2/invalidate_token'
  })
} as const

export { oauth2 }
