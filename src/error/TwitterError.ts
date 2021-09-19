import { ErrorResponse } from './ErrorResponse'
import { ErrorCode } from './ErrorCode'

class TwitterError extends Error {
  readonly httpStatus: number
  readonly headers: Record<string, string>
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

interface TwitterErrorProperty {
  httpStatus: number
  headers: Record<string, string>
  body: ErrorResponse
}

export { TwitterError, TwitterErrorProperty }
