import fetch from 'cross-fetch'
import { Endpoint } from './endpoint'
import { Credential } from './auth'
import { buildUrlWithParams } from './buildUrlWithParams'
import { TwitterError } from './error'

const defaultHeaders = {
  'User-Agent': 'bluetail'
} as const

const defaultParams = {
  tweet_mode: 'extended'
} as const

const request = async (
  endpoint: Endpoint,
  option: RequestOption
): Promise<unknown> => {
  const params: Record<string, string> = { ...defaultParams, ...option.params }

  const authHeaders = option.credential.toHeaders({
    endpoint,
    params,
    body: option.body
  })
  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...authHeaders,
    ...option.headers
  }

  let body: string | undefined

  switch (endpoint.payloadType()) {
    case 'UrlEncodedForm':
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      body = new URLSearchParams(
        option.body as Record<string, string>
      ).toString()
      break
    case 'JSON':
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(option.body)
      break
    case 'None':
      if (option.body != null) {
        throw new TypeError('Body must not be set for this endpoint.')
      }
      break
    default:
      throw new TypeError(`Unknown payload type: ${endpoint.payloadType()}`)
  }

  const resp = await fetch(buildUrlWithParams(endpoint.url(), params), {
    method: endpoint.method(),
    headers,
    body
  })
  const respHeaders = Object.fromEntries(resp.headers)
  const respBody = await resp.json()

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

interface RequestOption {
  credential: Credential
  params?: Record<string, string>
  headers?: Record<string, string>
  body?: unknown
}

export { request, RequestOption }
