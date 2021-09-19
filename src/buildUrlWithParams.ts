const buildUrlWithParams = (
  url: string,
  params?: Record<string, any>
): string => {
  const urlObj = new URL(url)

  if (params != null) {
    for (const [key, value] of Object.entries(params)) {
      if (urlObj.pathname.includes(`:${key}`)) {
        urlObj.pathname = urlObj.pathname.replace(`:${key}`, value)
      } else {
        urlObj.searchParams.set(key, value)
      }
    }
  }

  return urlObj.toString()
}

export { buildUrlWithParams }
