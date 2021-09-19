import { Credential } from './Credential'
import { AuthorizeOption } from './AuthorizeOption'
import { KeyPair } from './KeyPair'
import { toBase64 } from '../toBase64'

// Credential used in oauth2/token request
class GetBearerTokenCredential implements Credential {
  constructor(public consumer: KeyPair) {}

  toHeaders(_option?: AuthorizeOption): Record<string, string> {
    const encodedKey = encodeURIComponent(this.consumer.key)
    const encodedSecret = encodeURIComponent(this.consumer.secret)

    const base64 = toBase64(`${encodedKey}:${encodedSecret}`)
    return {
      Authorization: `Basic ${base64}`
    }
  }
}

export { GetBearerTokenCredential }
