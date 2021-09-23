import {
  KeyPair,
  Credential,
  UserAuthCredential,
  GetBearerTokenCredential
} from './auth'
import { Endpoint, oauth1, oauth2, v1 } from './endpoint'
import { makeRequest, RequestOptions } from './request'
import { parseResponse, TwitterResponse } from './response'
import {
  GetAccessTokenResponse,
  OAuth1RequestTokenResponse,
  OAuth1AccessTokenResponse,
  OAuth1InvalidateTokenResponse,
  OAuth2TokenResponse,
  OAuth2InvalidateTokenResponse
} from './model'

/**
 * Twitter API client
 *
 * @example
 * ```ts
 * import { Bluetail, UserAuthCredential } from 'bluetail'
 *
 * const credential = new UserAuthCredential(...)
 * const bluetail = new Bluetail(credential)
 *
 * const tweet = await bluetail.v1.tweet.show({
 *   params: { id: '20' }
 * })
 *
 * console.log(tweet.full_text)
 * ```
 */
class Bluetail {
  /**
   * URL parameters
   */
  defaultParams: Record<string, any> = {
    tweet_mode: 'extended'
  }

  /**
   * Request headers
   */
  defaultHeaders: Record<string, any> = {
    'User-Agent': 'bluetail',
    Accept: 'application/json'
  }

  /**
   * Request timeout in milliseconds
   */
  defaultTimeout: number = 10000

  constructor(public defaultCredential?: Credential) {}

  /**
   * Send a request to the endpoint.
   *
   * @param endpoint - An API endpoint to send request
   * @param options - Request options
   */
  async request<T = any>(
    endpoint: Endpoint,
    options: RequestOptions = {}
  ): Promise<TwitterResponse<T>> {
    if (options.credential == null) {
      options.credential = this.defaultCredential
    }
    if (options.timeout == null) {
      options.timeout = this.defaultTimeout
    }

    options.params = {
      ...this.defaultParams,
      ...options.params
    }
    options.headers = {
      ...this.defaultHeaders,
      ...options.headers
    }

    const resp = await makeRequest(endpoint, options)

    return await parseResponse<T>(resp)
  }

  /**
   * OAuth 1.0a API methods
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/oauth-1-0a}
   */
  readonly oauth1 = {
    /**
     * Returns request token.
     *
     * @param consumer - A consumer token
     * @param callbackUrl - Callback URL
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/request_token}
     */
    getRequestToken: async (
      consumer: KeyPair,
      callbackUrl: string
    ): Promise<KeyPair> => {
      const credential = new UserAuthCredential(consumer)
      const resp = await this.request<OAuth1RequestTokenResponse>(
        oauth1.getRequestToken,
        {
          credential,
          params: { oauth_callback: callbackUrl }
        }
      )

      if (resp.oauth_callback_confirmed === 'true') {
        return { key: resp.oauth_token, secret: resp.oauth_token_secret }
      } else {
        throw new Error('"oauth_callback_confirmed" is not "true"')
      }
    },

    /**
     * Returns authorize URL to redirect user.
     *
     * @param requestToken - A request token
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/authorize}
     */
    getAuthorizeUrl: (requestToken: KeyPair): string => {
      return `${oauth1.authorize.url()}?oauth_token=${requestToken.key}`
    },

    /**
     * Returns authenticate URL to redirect user.
     *
     * @param requestToken - A request token
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/authenticate}
     */
    getAuthenticateUrl: (requestToken: KeyPair): string => {
      return `${oauth1.authenticate.url()}?oauth_token=${requestToken.key}`
    },

    /**
     * Returns access token key and secret.
     *
     * @param consumer - A consumer token
     * @param requestToken - A request token
     * @param verifier - The verifier returned in the callback URL
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/access_token}
     */
    getAccessToken: async (
      consumer: KeyPair,
      requestToken: KeyPair,
      verifier: string
    ): Promise<GetAccessTokenResponse> => {
      const credential = new UserAuthCredential(consumer)
      const resp = await this.request<OAuth1AccessTokenResponse>(
        oauth1.getAccessToken,
        {
          credential,
          params: { oauth_token: requestToken.key, oauth_verifier: verifier }
        }
      )

      return {
        accessToken: {
          key: resp.oauth_token,
          secret: resp.oauth_token_secret
        },
        userId: resp.user_id,
        screenName: resp.screen_name
      }
    },

    /**
     * Invalidates access token.
     *
     * @param consumer - A consumer token
     * @param accessToken - An access token to invalidate
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/invalidate_access_token}
     */
    invalidateAccessToken: async (consumer: KeyPair, accessToken: KeyPair) => {
      const credential = new UserAuthCredential(consumer, accessToken)
      await this.request<OAuth1InvalidateTokenResponse>(
        oauth1.invalidateAccessToken,
        { credential }
      )
    }
  } as const

  /**
   * OAuth 2.0 API methods
   *
   * @see {@link https://developer.twitter.com/en/docs/authentication/oauth-2-0}
   */
  readonly oauth2 = {
    /**
     * Returns bearer token.
     *
     * @param consumer - A consumer token
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/token}
     */
    getBearerToken: async (consumer: KeyPair): Promise<string> => {
      const credential = new GetBearerTokenCredential(consumer)
      const resp = await this.request<OAuth2TokenResponse>(
        oauth2.getBearerToken,
        {
          credential,
          body: { grant_type: 'client_credentials' }
        }
      )

      if (resp.token_type === 'bearer') {
        return resp.access_token
      } else {
        throw new Error('"token_type" is not "bearer"')
      }
    },

    /**
     * Invalidates bearer token.
     *
     * Note: According to Twitter Developers Forum, this API seems to be broken since 2019.
     *
     * @param consumer - A consumer token
     * @param accessToken - The application owner's access token
     * @param bearerToken - A bearer token to invalidate
     *
     * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/invalidate_bearer_token}
     * @see {@link https://twittercommunity.com/t/oauth2-invalidate-token-not-working-with-sorry-that-page-does-not-exist-code-34-error/120646}
     */
    invalidateBearerToken: async (
      consumer: KeyPair,
      accessToken: KeyPair,
      bearerToken: string
    ) => {
      const credential = new UserAuthCredential(consumer, accessToken)
      await this.request<OAuth2InvalidateTokenResponse>(
        oauth2.invalidateBearerToken,
        {
          credential,
          params: { access_token: bearerToken }
        }
      )
    }
  } as const

  /**
   * v1 API methods
   *
   * @see {@link https://developer.twitter.com/en/docs/twitter-api}
   */
  readonly v1 = {
    account: {
      /**
       * Verifies user auth credentials and returns authorized user information.
       *
       * @param options - Request options
       *
       * @see {@link https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials}
       */
      verifyCredentials: async <T = any>(
        options: RequestOptions = {}
      ): Promise<TwitterResponse<T>> => {
        return await this.request<T>(v1.account.verifyCredentials, options)
      }
    },

    tweet: {
      /**
       * Returns a tweet, specified by the id parameter.
       *
       * @param options - Request options
       *
       * @see {@link https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-show-id}
       */
      show: async <T = any>(
        options: RequestOptions = {}
      ): Promise<TwitterResponse<T>> => {
        return await this.request<T>(v1.tweet.show, options)
      }
    }
  } as const
}

export { Bluetail }
