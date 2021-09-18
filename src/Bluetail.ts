import { KeyPair, Credential, UserAuthCredential } from './auth'
import { Endpoint, oauth1 } from './endpoint'
import { makeRequest, RequestOption } from './request'
import { parseResponse, TwitterResponse } from './response'
import {
  RequestTokenResponse,
  AccessTokenResponse,
  GetAccessTokenResponse
} from './model'

class Bluetail {
  defaultParams: Record<string, string> = {
    tweet_mode: 'extended'
  }

  defaultHeaders: Record<string, string> = {
    'User-Agent': 'bluetail',
    Accept: 'application/json'
  }

  constructor(public defaultCredential?: Credential) {}

  async request<T = any>(
    endpoint: Endpoint,
    option: RequestOption = {}
  ): Promise<TwitterResponse<T>> {
    if (option.credential == null) {
      option.credential = this.defaultCredential
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
      const resp = await this.request<RequestTokenResponse>(
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
      const resp = await this.request<AccessTokenResponse>(
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
    }
  } as const
}

export { Bluetail }
