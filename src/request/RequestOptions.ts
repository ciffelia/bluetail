import { Credential } from '../auth'

/**
 * Options for Twitter API request
 */
interface RequestOptions {
  /**
   * Credential
   */
  credential?: Credential

  /**
   * URL parameters
   */
  params?: Record<string, any>

  /**
   * Request headers
   */
  headers?: Record<string, any>

  /**
   * Request body
   */
  body?: unknown

  /**
   * Request timeout in milliseconds
   */
  timeout?: number
}

export { RequestOptions }
