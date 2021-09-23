import { Credential } from './Credential'
import { AuthorizeOptions } from './AuthorizeOptions'

/**
 * Credential for OAuth 2.0 authorization (app auth)
 */
class AppAuthCredential implements Credential {
  constructor(public bearerToken: string) {}

  toHeaders(_options?: AuthorizeOptions): Record<string, string> {
    return {
      Authorization: `Bearer ${this.bearerToken}`
    }
  }
}

export { AppAuthCredential }
