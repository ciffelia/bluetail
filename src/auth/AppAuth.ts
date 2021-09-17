import { AuthMethod } from './AuthMethod'
import { AuthorizeOption } from './AuthorizeOption'

// App auth (OAuth 1.0a)
class AppAuth implements AuthMethod {
  constructor(public bearerToken: string) {}

  toHeaders(_option?: AuthorizeOption): Record<string, string> {
    return {
      Authorization: `Bearer ${this.bearerToken}`
    }
  }
}

export { AppAuth }
