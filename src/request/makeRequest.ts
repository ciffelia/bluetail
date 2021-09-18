import fetch, { Response } from 'cross-fetch'
import { Endpoint } from '../endpoint'
import { RequestOption } from './RequestOption'
import { buildUrlWithParams } from '../buildUrlWithParams'
import { prepareBody } from './prepareBody'

const makeRequest = async (
  endpoint: Endpoint,
  option: RequestOption
): Promise<Response> => {
  const authHeaders = option.credential?.toHeaders({
    endpoint,
    params: option.params,
    body: option.body
  })
  const headers: Record<string, string> = {
    ...authHeaders,
    ...option.headers
  }

  switch (endpoint.payloadType()) {
    case 'UrlEncodedForm':
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      break
    case 'JSON':
      headers['Content-Type'] = 'application/json'
      break
  }

  const body = prepareBody(option.body, endpoint.payloadType())

  return await fetch(buildUrlWithParams(endpoint.url(), option.params), {
    method: endpoint.method(),
    headers,
    body
  })
}

export { makeRequest }
