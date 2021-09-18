import { Credential } from './auth'
import { Endpoint } from './endpoint'
import { makeRequest, RequestOption } from './request'
import { parseResponse, TwitterResponse } from './response'

class Bluetail {
  defaultParams: Record<string, string> = {
    tweet_mode: 'extended'
  }

  defaultHeaders: Record<string, string> = {
    'User-Agent': 'bluetail'
  }

  constructor(public credential?: Credential) {}

  async request<T = any>(
    endpoint: Endpoint,
    option: RequestOption = {}
  ): Promise<TwitterResponse<T>> {
    if (option.credential == null) {
      option.credential = this.credential
    }

    option.params = {
      ...this.defaultParams,
      ...option.params
    }
    option.headers = {
      ...this.defaultHeaders,
      ...option.headers
    }

    const resp = await makeRequest(endpoint, option)

    return await parseResponse<T>(resp)
  }
}

export { Bluetail }
