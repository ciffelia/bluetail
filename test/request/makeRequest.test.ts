import { Endpoint, PayloadType, TimeoutError } from '../../src'
import { makeRequest } from '../../src/request'
import { appCredential, userCredential } from '../testUtils/validToken'
import {
  invalidAppCredential,
  invalidUserCredential
} from '../testUtils/invalidToken'

describe('makeRequest', () => {
  const endpoint: Endpoint = {
    method: () => 'GET',
    url: () => 'https://api.twitter.com/1.1/statuses/show/:id.json',
    payloadType: () => 'None'
  }

  it('can be authorized with app auth', async () => {
    if (appCredential == null) return
    const resp = await makeRequest(endpoint, {
      credential: appCredential,
      params: { id: '20' },
      timeout: 10000
    })

    expect(resp.status).toEqual(200)
    expect((await resp.json()).text).toEqual('just setting up my twttr')
  })

  it('can be authorized with user auth', async () => {
    if (userCredential == null) return
    const resp = await makeRequest(endpoint, {
      credential: userCredential,
      params: { id: '20' },
      timeout: 10000
    })

    expect(resp.status).toEqual(200)
    expect((await resp.json()).text).toEqual('just setting up my twttr')
  })

  it('should throw error for invalid payload type', async () => {
    await expect(
      makeRequest(endpoint, { credential: invalidAppCredential, body: {} })
    ).rejects.toThrow(new TypeError('Body must not be set for this endpoint.'))
  })

  it('should throw error for unknown payload type', async () => {
    const endpoint: Endpoint = {
      method: () => 'GET',
      url: () => 'https://api.twitter.com/1.1/account/verify_credentials.json',
      payloadType: () => 'Unknown' as PayloadType
    }

    await expect(
      makeRequest(endpoint, { credential: invalidAppCredential })
    ).rejects.toThrow(new TypeError('Unknown payload type: Unknown'))
  })

  it('should return response for invalid app auth', async () => {
    const resp = await makeRequest(endpoint, {
      credential: invalidAppCredential
    })

    expect(resp.status).toEqual(401)
    expect(await resp.json()).toEqual({
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    })
  })

  it('should return response for invalid user auth', async () => {
    const resp = await makeRequest(endpoint, {
      credential: invalidUserCredential
    })

    expect(resp.status).toEqual(401)
    expect(await resp.json()).toEqual({
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    })
  })

  it('should throw error on timeout', async () => {
    const endpoint: Endpoint = {
      method: () => 'GET',
      url: () => 'https://httpstat.us/200?sleep=5000',
      payloadType: () => 'None'
    }

    await expect(
      makeRequest(endpoint, {
        timeout: 1000
      })
    ).rejects.toThrow(new TimeoutError())
  })
})
