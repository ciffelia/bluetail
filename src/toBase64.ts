const toBase64 = (source: string): string => {
  if (typeof btoa === 'function') {
    return btoa(source)
  }

  if (typeof require === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Buffer } = require('buffer')
    return Buffer.from(source).toString('base64')
  }

  throw new Error('No method available to encode string using Base64.')
}

export { toBase64 }
