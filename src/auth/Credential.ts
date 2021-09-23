import { AuthorizeOptions } from './AuthorizeOptions'

interface Credential {
  toHeaders: (options: AuthorizeOptions) => Record<string, string>
}

export { Credential }
