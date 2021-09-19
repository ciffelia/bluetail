import { Endpoint } from '../endpoint'

interface AuthorizeOption {
  endpoint: Endpoint
  params?: Record<string, string>
  body?: unknown
}

export { AuthorizeOption }
