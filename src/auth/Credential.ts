import { AuthorizeOption } from './AuthorizeOption'

interface Credential {
  toHeaders: (option: AuthorizeOption) => Record<string, string>
}

export { Credential }
