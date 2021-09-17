import { Endpoint } from '../Endpoint'

interface AuthorizeOption {
  endpoint: Endpoint
  params?: Record<string, string>
  body?: unknown
}

export { AuthorizeOption }
