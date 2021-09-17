import { request } from '../src/request'
import { AppAuth, Endpoint, KeyPair, UserAuth } from '../src'

describe('request', () => {
  const endpoint: Endpoint = {
    method: () => 'GET',
    url: () => 'https://api.twitter.com/1.1/account/verify_credentials.json',
    payloadType: () => 'None'
  }

  it('should return error for invalid app auth', async () => {
    const auth = new AppAuth('bearer_token')

    const resp = await request(endpoint, { auth })
    expect(resp.status).toEqual(401)
    expect(await resp.json()).toEqual({
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    })
  })

  it('should return error for invalid user auth', async () => {
    const consumer: KeyPair = {
      key: 'consumer_key',
      secret: 'consumer_secret'
    }
    const accessToken: KeyPair = {
      key: 'access_token_key',
      secret: 'access_token_secret'
    }
    const auth = new UserAuth(consumer, accessToken)

    const resp = await request(endpoint, { auth })
    expect(resp.status).toEqual(401)
    expect(await resp.json()).toEqual({
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    })
  })
})
