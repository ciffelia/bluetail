const buildUrlWithParams = (
  url: string,
  params?: Record<string, string>
): string => {
  const urlObj = new URL(url)

  if (params != null) {
    for (const [key, value] of Object.entries(params)) {
      urlObj.searchParams.set(key, value)
    }
  }

  return urlObj.toString()
}

export { buildUrlWithParams }
