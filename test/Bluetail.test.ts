import {
  Endpoint,
  PayloadType,
  KeyPair,
  AppAuthCredential,
  UserAuthCredential,
  Bluetail
} from '../src'

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
      const credential = new AppAuthCredential('bearer_token')
      const bluetail = new Bluetail(credential)

      expect(bluetail.credential).toEqual(credential)
    })

    it('returns an instance without credential', () => {
      const bluetail = new Bluetail()
      expect(bluetail.credential).toBeUndefined()
    })
  })

  describe('request', () => {
    const endpoint: Endpoint = {
      method: () => 'GET',
      url: () => 'https://api.twitter.com/1.1/account/verify_credentials.json',
      payloadType: () => 'None'
    }

    it('should throw error for invalid payload type', async () => {
      const credential = new AppAuthCredential('bearer_token')
      const bluetail = new Bluetail(credential)

      await expect(bluetail.request(endpoint, { body: {} })).rejects.toThrow(
        new TypeError('Body must not be set for this endpoint.')
      )
    })

    it('should throw error for unknown payload type', async () => {
      const endpoint: Endpoint = {
        method: () => 'GET',
        url: () =>
          'https://api.twitter.com/1.1/account/verify_credentials.json',
        payloadType: () => 'Unknown' as PayloadType
      }

      const credential = new AppAuthCredential('bearer_token')
      const bluetail = new Bluetail(credential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        new TypeError('Unknown payload type: Unknown')
      )
    })

    it('should throw error for invalid app auth', async () => {
      const credential = new AppAuthCredential('bearer_token')
      const bluetail = new Bluetail(credential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        'Twitter API returned errors: Invalid or expired token.'
      )
    })

    it('should throw error for invalid user auth', async () => {
      const consumer: KeyPair = {
        key: 'consumer_key',
        secret: 'consumer_secret'
      }
      const accessToken: KeyPair = {
        key: 'access_token_key',
        secret: 'access_token_secret'
      }
      const credential = new UserAuthCredential(consumer, accessToken)
      const bluetail = new Bluetail(credential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        'Twitter API returned errors: Invalid or expired token.'
      )
    })
  })
})
