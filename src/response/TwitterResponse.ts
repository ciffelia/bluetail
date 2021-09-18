type TwitterResponse<T> = T & {
  _headers: Record<string, string>
}

export { TwitterResponse }
