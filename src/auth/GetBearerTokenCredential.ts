import { Credential } from './Credential'
import { AuthorizeOptions } from './AuthorizeOptions'
import { KeyPair } from './KeyPair'
import { toBase64 } from '../toBase64'

/**
 * Credential for `oauth2/token` request authorization
 *
 * @see {@link https://developer.twitter.com/en/docs/authentication/api-reference/token}
 */
class GetBearerTokenCredential implements Credential {
  constructor(public consumer: KeyPair) {}

  toHeaders(_options?: AuthorizeOptions): Record<string, string> {
    const encodedKey = encodeURIComponent(this.consumer.key)
    const encodedSecret = encodeURIComponent(this.consumer.secret)

    const base64 = toBase64(`${encodedKey}:${encodedSecret}`)
    return {
      Authorization: `Basic ${base64}`
    }
  }
}

export { GetBearerTokenCredential }
