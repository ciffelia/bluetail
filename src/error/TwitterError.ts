import { ErrorResponse } from './ErrorResponse'
import { ErrorCode } from './ErrorCode'

class TwitterError extends Error {
  readonly httpStatus: number
  readonly headers: Record<string, string>
  readonly errors: ErrorCode[]

  constructor(property: TwitterErrorProperty) {
    const returnedErrorMessages = property.body.errors
      .map((error) => error.message)
      .join(', ')

    super(`Twitter API returned errors: ${returnedErrorMessages}`)

    this.httpStatus = property.httpStatus
    this.headers = property.headers
    this.errors = property.body.errors
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
