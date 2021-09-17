import OAuth1 from 'oauth-1.0a'
import { AuthMethod } from './AuthMethod'
import { KeyPair } from './KeyPair'
import { AuthorizeOption } from './AuthorizeOption'
import { createOAuth1Client } from './createOAuth1Client'
import { buildUrlWithParams } from '../buildUrlWithParams'

// User auth (OAuth 2.0)
class UserAuth implements AuthMethod {
  constructor(public consumer: KeyPair, public accessToken: KeyPair) {}

  toHeaders(option: AuthorizeOption): Record<string, string> {
    const oauthClient = createOAuth1Client(this.consumer)

    const request: OAuth1.RequestOptions = {
      url: buildUrlWithParams(option.endpoint.url(), option.params),
      method: option.endpoint.method()
    }
    if (option.endpoint.payloadType() === 'UrlEncodedForm') {
      request.data = option.body
    }

    const authorization = oauthClient.authorize(request, this.accessToken)

    return oauthClient.toHeader(authorization) as unknown as Record<
      string,
      string
    >
  }
}

export { UserAuth }
