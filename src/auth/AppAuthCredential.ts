import { Credential } from './Credential'
import { AuthorizeOption } from './AuthorizeOption'

// App auth (OAuth 2.0)
class AppAuthCredential implements Credential {
  constructor(public bearerToken: string) {}

  toHeaders(_option?: AuthorizeOption): Record<string, string> {
    return {
      Authorization: `Bearer ${this.bearerToken}`
    }
  }
}

export { AppAuthCredential }
