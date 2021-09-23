/**
 * Twitter API error code and text
 *
 * @see {@link https://developer.twitter.com/en/support/twitter-api/error-troubleshooting#error-codes}
 */
interface ErrorCode {
  code: number
  message: string
}

export { ErrorCode }
