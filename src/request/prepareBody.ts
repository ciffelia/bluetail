import { PayloadType } from '../endpoint'

const prepareBody = (
  body: unknown,
  payloadType: PayloadType
): string | undefined => {
  switch (payloadType) {
    case 'UrlEncodedForm':
      return new URLSearchParams(body as Record<string, string>).toString()
    case 'JSON':
      return JSON.stringify(body)
    case 'None':
      if (body == null) {
        return
      } else {
        throw new TypeError('Body must not be set for this endpoint.')
      }
    default:
      throw new TypeError(`Unknown payload type: ${payloadType as string}`)
  }
}

export { prepareBody }
