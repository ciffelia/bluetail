import fetch, { Response } from 'fth'
import AbortController from 'abort-controller'
import { Endpoint } from '../endpoint'
import { RequestOption } from './RequestOption'
import { buildUrlWithParams } from '../buildUrlWithParams'
import { prepareBody } from './prepareBody'
import { TimeoutError } from '../error'

const makeRequest = async (
  endpoint: Endpoint,
  option: RequestOption
): Promise<Response> => {
  const authHeaders = option.credential?.toHeaders({
    endpoint,
    params: option.params,
    body: option.body
  })
  const headers: Record<string, any> = {
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

  const controller = new AbortController()
  const timeout = setTimeout(() => {
    if (option.timeout != null) {
      controller.abort()
    }
  }, option.timeout ?? 0)

  try {
    return await fetch(buildUrlWithParams(endpoint.url(), option.params), {
      method: endpoint.method(),
      headers,
      body,
      signal: controller.signal
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new TimeoutError()
    } else {
      throw err
    }
  } finally {
    clearTimeout(timeout)
  }
}

export { makeRequest }
