import { Credential } from './Credential'
import { AuthorizeOptions } from './AuthorizeOptions'

// App auth (OAuth 2.0)
class AppAuthCredential implements Credential {
  constructor(public bearerToken: string) {}

  toHeaders(_options?: AuthorizeOptions): Record<string, string> {
    return {
      Authorization: `Bearer ${this.bearerToken}`
    }
  }
}

export { AppAuthCredential }
