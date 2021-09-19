import { Buffer } from 'buffer'
import { Credential } from './Credential'
import { AuthorizeOption } from './AuthorizeOption'
import { KeyPair } from './KeyPair'

// Credential used in oauth2/token request
class GetBearerTokenCredential implements Credential {
  constructor(public consumer: KeyPair) {}

  toHeaders(_option?: AuthorizeOption): Record<string, string> {
    const encodedKey = encodeURIComponent(this.consumer.key)
    const encodedSecret = encodeURIComponent(this.consumer.secret)

    const base64 = Buffer.from(`${encodedKey}:${encodedSecret}`).toString(
      'base64'
    )

    return {
      Authorization: `Basic ${base64}`
    }
  }
}

export { GetBearerTokenCredential }
