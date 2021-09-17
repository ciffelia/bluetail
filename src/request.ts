import fetch, { Response } from 'cross-fetch'
import { Endpoint } from './endpoint'
import { AuthMethod } from './auth'
import { buildUrlWithParams } from './buildUrlWithParams'

const defaultHeaders = {
  'User-Agent': 'bluetail'
} as const

const defaultParams = {
  tweet_mode: 'extended'
} as const

const request = async (
  endpoint: Endpoint,
  option: RequestOption
): Promise<Response> => {
  const headers: Record<string, string> = defaultHeaders
  const params: Record<string, string> = { ...defaultParams, ...option.params }
  let body: string | undefined

  const authHeaders = option.auth.toHeaders({
    endpoint,
    params,
    body: option.body
  })
  Object.assign(headers, authHeaders)

  if (endpoint.payloadType() === 'UrlEncodedForm') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = new URLSearchParams(option.body as Record<string, string>).toString()
  } else if (endpoint.payloadType() === 'JSON') {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(option.body)
  } else if (endpoint.payloadType() === 'None') {
    if (option.body != null) {
      throw new TypeError('Body must not be set for this endpoint.')
    }
  } else {
    throw new TypeError(`Unknown payload type: ${endpoint.payloadType()}`)
  }

  return await fetch(buildUrlWithParams(endpoint.url(), params), {
    method: endpoint.method(),
    headers,
    body
  })
}

interface RequestOption {
  auth: AuthMethod
  params?: Record<string, string>
  body?: unknown
}

export { request, RequestOption }
