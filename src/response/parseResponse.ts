import { Response } from 'cross-fetch'
import { TwitterResponse } from './TwitterResponse'
import { TwitterError } from '../error'

const parseResponse = async <T>(
  resp: Response
): Promise<TwitterResponse<T>> => {
  const respHeaders = Object.fromEntries(resp.headers)

  const respBodyText = await resp.text()
  let respBody
  try {
    respBody = JSON.parse(respBodyText)
  } catch {
    respBody = Object.fromEntries(new URLSearchParams(respBodyText))
  }

  if (resp.ok) {
    return {
      _headers: respHeaders,
      ...respBody
    }
  } else {
    throw new TwitterError({
      httpStatus: resp.status,
      headers: respHeaders,
      body: respBody
    })
  }
}

export { parseResponse }
