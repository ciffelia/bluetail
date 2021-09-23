import { Endpoint } from '../endpoint'

interface AuthorizeOptions {
  endpoint: Endpoint
  params?: Record<string, any>
  body?: unknown
}

export { AuthorizeOptions }
