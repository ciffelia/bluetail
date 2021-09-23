import OAuth1 from 'oauth-1.0a'
import { Credential } from './Credential'
import { KeyPair } from './KeyPair'
import { AuthorizeOptions } from './AuthorizeOptions'
import { createOAuth1Client } from './createOAuth1Client'
import { buildUrlWithParams } from '../buildUrlWithParams'

// User auth (OAuth 1.0a)
class UserAuthCredential implements Credential {
  constructor(public consumer: KeyPair, public accessToken?: KeyPair) {}

  toHeaders(options: AuthorizeOptions): Record<string, string> {
    const oauthClient = createOAuth1Client(this.consumer)

    const request: OAuth1.RequestOptions = {
      url: buildUrlWithParams(options.endpoint.url(), options.params),
      method: options.endpoint.method()
    }
    if (options.endpoint.payloadType() === 'UrlEncodedForm') {
      request.data = options.body
    }

    const authorization = oauthClient.authorize(request, this.accessToken)

    return oauthClient.toHeader(authorization) as unknown as Record<
      string,
      string
    >
  }
}

export { UserAuthCredential }
