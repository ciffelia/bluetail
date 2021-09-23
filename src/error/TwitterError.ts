import { ErrorResponse } from './ErrorResponse'
import { ErrorCode } from './ErrorCode'

/**
 * An error thrown when Twitter API returned non-2xx HTTP status code
 */
class TwitterError extends Error {
  /**
   * HTTP status code in API response
   */
  readonly httpStatus: number

  /**
   * HTTP headers in API response
   */
  readonly headers: Record<string, string>

  /**
   * List of error codes in API response
   */
  readonly errors: ErrorCode[]

  constructor(property: TwitterErrorProperty) {
    const errors = property.body.errors ?? []
    const returnedErrorMessages = errors
      .map((error) => error.message)
      .join(', ')

    super(
      `Twitter API returned HTTP ${property.httpStatus}: ${returnedErrorMessages}`
    )

    this.httpStatus = property.httpStatus
    this.headers = property.headers
    this.errors = errors
  }

  get name(): string {
    return this.constructor.name
  }
}

/**
 * Properties to create {@link TwitterError}
 */
interface TwitterErrorProperty {
  httpStatus: number
  headers: Record<string, string>
  body: ErrorResponse
}

export { TwitterError, TwitterErrorProperty }
