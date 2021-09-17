import { AuthorizeOption } from './AuthorizeOption'

interface AuthMethod {
  toHeaders: (option: AuthorizeOption) => Record<string, string>
}

export { AuthMethod }
