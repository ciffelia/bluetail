import { Credential } from '../auth'

/**
 * Options for Twitter API request
 */
interface RequestOption {
  credential?: Credential
  params?: Record<string, any>
  headers?: Record<string, any>
  body?: unknown
  timeout?: number
}

export { RequestOption }
