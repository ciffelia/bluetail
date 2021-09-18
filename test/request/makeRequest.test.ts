import {
  Endpoint,
  PayloadType,
  KeyPair,
  AppAuthCredential,
  UserAuthCredential
} from '../../src'
import { makeRequest } from '../../src/request'

describe('makeRequest', () => {
  const endpoint: Endpoint = {
    method: () => 'GET',
    url: () => 'https://api.twitter.com/1.1/account/verify_credentials.json',
    payloadType: () => 'None'
  }

  it('should throw error for invalid payload type', async () => {
    const credential = new AppAuthCredential('bearer_token')

    await expect(
      makeRequest(endpoint, { credential, body: {} })
    ).rejects.toThrow(new TypeError('Body must not be set for this endpoint.'))
  })

  it('should throw error for unknown payload type', async () => {
    const endpoint: Endpoint = {
      method: () => 'GET',
      url: () => 'https://api.twitter.com/1.1/account/verify_credentials.json',
      payloadType: () => 'Unknown' as PayloadType
    }
    const credential = new AppAuthCredential('bearer_token')

    await expect(makeRequest(endpoint, { credential })).rejects.toThrow(
      new TypeError('Unknown payload type: Unknown')
    )
  })

  it('should return response for invalid app auth', async () => {
    const credential = new AppAuthCredential('bearer_token')

    const resp = await makeRequest(endpoint, { credential })

    expect(resp.status).toEqual(401)
    expect(await resp.json()).toEqual({
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    })
  })

  it('should return response for invalid user auth', async () => {
    const consumer: KeyPair = {
      key: 'consumer_key',
      secret: 'consumer_secret'
    }
    const accessToken: KeyPair = {
      key: 'access_token_key',
      secret: 'access_token_secret'
    }
    const credential = new UserAuthCredential(consumer, accessToken)

    const resp = await makeRequest(endpoint, { credential })

    expect(resp.status).toEqual(401)
    expect(await resp.json()).toEqual({
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    })
  })
})
