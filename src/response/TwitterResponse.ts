type TwitterResponse<T> = {
  _headers: Record<string, string>
} & T

export { TwitterResponse }
