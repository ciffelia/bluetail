import fetch, { Response } from 'fth'
import AbortController from 'abort-controller'
import { Endpoint } from '../endpoint'
import { RequestOptions } from './RequestOptions'
import { buildUrlWithParams } from '../buildUrlWithParams'
import { prepareBody } from './prepareBody'
import { TimeoutError } from '../error'

const makeRequest = async (
  endpoint: Endpoint,
  options: RequestOptions
): Promise<Response> => {
  const authHeaders = options.credential?.toHeaders({
    endpoint,
    params: options.params,
    body: options.body
  })
  const headers: Record<string, any> = {
    ...authHeaders,
    ...options.headers
  }

  switch (endpoint.payloadType()) {
    case 'UrlEncodedForm':
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      break
    case 'JSON':
      headers['Content-Type'] = 'application/json'
      break
  }

  const body = prepareBody(options.body, endpoint.payloadType())

  const controller = new AbortController()
  const timeout = setTimeout(() => {
    if (options.timeout != null) {
      controller.abort()
    }
  }, options.timeout ?? 0)

  try {
    return await fetch(buildUrlWithParams(endpoint.url(), options.params), {
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
