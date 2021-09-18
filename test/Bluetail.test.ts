import { Endpoint, PayloadType, Bluetail } from '../src'
import { appCredential, userCredential } from './token/validToken'
import {
  invalidAppCredential,
  invalidUserCredential
} from './token/invalidToken'

describe('Bluetail', () => {
  describe('defaultParams', () => {
    it('can be mutated', () => {
      const bluetail = new Bluetail()
      bluetail.defaultParams.foo = 'bar'

      expect(bluetail.defaultParams.foo).toEqual('bar')
    })
  })

  describe('defaultHeaders', () => {
    it('can be mutated', () => {
      const bluetail = new Bluetail()
      bluetail.defaultHeaders['X-User'] = 'me'

      expect(bluetail.defaultHeaders['X-User']).toEqual('me')
    })
  })

  describe('constructor', () => {
    it('returns an instance with credential', () => {
      const bluetail = new Bluetail(invalidAppCredential)
      expect(bluetail.defaultCredential).toEqual(invalidAppCredential)
    })

    it('returns an instance without credential', () => {
      const bluetail = new Bluetail()
      expect(bluetail.defaultCredential).toBeUndefined()
    })
  })

  describe('request', () => {
    const endpoint: Endpoint = {
      method: () => 'GET',
      url: () => 'https://api.twitter.com/1.1/statuses/show/:id.json',
      payloadType: () => 'None'
    }

    it('can be authorized with app auth', async () => {
      if (appCredential == null) return
      const bluetail = new Bluetail(appCredential)

      const tweet = await bluetail.request(endpoint, {
        params: { id: '20' }
      })

      expect(tweet.id_str).toEqual('20')
      expect(tweet.full_text).toEqual('just setting up my twttr')
    })

    it('can be authorized with user auth', async () => {
      if (userCredential == null) return
      const bluetail = new Bluetail(userCredential)

      const tweet = await bluetail.request(endpoint, {
        params: { id: '20' }
      })

      expect(tweet.id_str).toEqual('20')
      expect(tweet.full_text).toEqual('just setting up my twttr')
    })

    it('should include headers', async () => {
      if (appCredential == null) return
      const bluetail = new Bluetail(appCredential)

      const tweet = await bluetail.request(endpoint, {
        params: { id: '20' }
      })

      expect(tweet._headers['x-rate-limit-limit']).toEqual('900')
    })

    it('should throw error for invalid payload type', async () => {
      const bluetail = new Bluetail(invalidAppCredential)

      await expect(bluetail.request(endpoint, { body: {} })).rejects.toThrow(
        new TypeError('Body must not be set for this endpoint.')
      )
    })

    it('should throw error for unknown payload type', async () => {
      const endpoint: Endpoint = {
        method: () => 'GET',
        url: () =>
          'https://api.twitter.com/1.1/application/rate_limit_status.json',
        payloadType: () => 'Unknown' as PayloadType
      }

      const bluetail = new Bluetail(invalidAppCredential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        new TypeError('Unknown payload type: Unknown')
      )
    })

    it('should throw error for invalid app auth', async () => {
      const bluetail = new Bluetail(invalidAppCredential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        'Twitter API returned errors: Invalid or expired token.'
      )
    })

    it('should throw error for invalid user auth', async () => {
      const bluetail = new Bluetail(invalidUserCredential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        'Twitter API returned errors: Invalid or expired token.'
      )
    })
  })
})
