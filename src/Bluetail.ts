import {
  KeyPair,
  Credential,
  UserAuthCredential,
  GetBearerTokenCredential
} from './auth'
import { Endpoint, oauth1, oauth2, v1 } from './endpoint'
import { makeRequest, RequestOption } from './request'
import { parseResponse, TwitterResponse } from './response'
import {
  GetAccessTokenResponse,
  OAuth1RequestTokenResponse,
  OAuth1AccessTokenResponse,
  OAuth1InvalidateTokenResponse,
  OAuth2TokenResponse,
  OAuth2InvalidateTokenResponse
} from './model'

class Bluetail {
  defaultParams: Record<string, any> = {
    tweet_mode: 'extended'
  }

  defaultHeaders: Record<string, any> = {
    'User-Agent': 'bluetail',
    Accept: 'application/json'
  }

  defaultTimeout: number = 10000

  constructor(public defaultCredential?: Credential) {}

  async request<T = any>(
    endpoint: Endpoint,
    option: RequestOption = {}
  ): Promise<TwitterResponse<T>> {
    if (option.credential == null) {
      option.credential = this.defaultCredential
    }
    if (option.timeout == null) {
      option.timeout = this.defaultTimeout
    }

    option.params = {
      ...this.defaultParams,
      ...option.params
    }
    option.headers = {
      ...this.defaultHeaders,
      ...option.headers
    }

    const resp = await makeRequest(endpoint, option)

    return await parseResponse<T>(resp)
  }

  readonly oauth1 = {
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

    getAuthorizeUrl: (requestToken: KeyPair): string => {
      return `${oauth1.authorize.url()}?oauth_token=${requestToken.key}`
    },

    getAuthenticateUrl: (requestToken: KeyPair): string => {
      return `${oauth1.authenticate.url()}?oauth_token=${requestToken.key}`
    },

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

    invalidateAccessToken: async (consumer: KeyPair, accessToken: KeyPair) => {
      const credential = new UserAuthCredential(consumer, accessToken)
      await this.request<OAuth1InvalidateTokenResponse>(
        oauth1.invalidateAccessToken,
        { credential }
      )
    }
  } as const

  readonly oauth2 = {
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

    // Important note: This API seems to be broken since 2019: https://twittercommunity.com/t/oauth2-invalidate-token-not-working-with-sorry-that-page-does-not-exist-code-34-error/120646
    // Note: the second argument must be the application owner's access token & access token secret
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

  readonly v1 = {
    account: {
      verifyCredentials: async <T = any>(
        option: RequestOption = {}
      ): Promise<TwitterResponse<T>> => {
        return await this.request<T>(v1.account.verifyCredentials, option)
      }
    },

    tweet: {
      show: async <T = any>(
        option: RequestOption = {}
      ): Promise<TwitterResponse<T>> => {
        return await this.request<T>(v1.tweet.show, option)
      }
    }
  } as const
}

export { Bluetail }
