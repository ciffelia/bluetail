import { Endpoint } from '../endpoint'

interface AuthorizeOption {
  endpoint: Endpoint
  params?: Record<string, any>
  body?: unknown
}

export { AuthorizeOption }
