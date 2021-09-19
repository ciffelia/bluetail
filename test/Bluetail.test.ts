import { Endpoint, PayloadType, Bluetail } from '../src'
import {
  callbackUrl,
  consumer,
  appCredential,
  userCredential
} from './token/validToken'
import {
  invalidConsumer,
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
        'Twitter API returned HTTP 401: Invalid or expired token.'
      )
    })

    it('should throw error for invalid user auth', async () => {
      const bluetail = new Bluetail(invalidUserCredential)

      await expect(bluetail.request(endpoint)).rejects.toThrow(
        'Twitter API returned HTTP 401: Invalid or expired token.'
      )
    })
  })

  describe('oauth1', () => {
    describe('getRequestToken', () => {
      it('should returns request token', async () => {
        if (callbackUrl == null || consumer == null || appCredential == null)
          return
        const bluetail = new Bluetail(appCredential)

        const resp = await bluetail.oauth1.getRequestToken(
          consumer,
          callbackUrl
        )

        expect(resp.key).toBeDefined()
        expect(resp.secret).toBeDefined()
      })

      // The OAuth 1.0a spec says "The request MUST be signed": https://oauth.net/core/1.0a/#rfc.section.6.1.1
      // However, Twitter API doesn't seem to verify the signature in oauth/request_token request.
      // So skipping this test for now.
      it.skip('should throws error for invalid bearer token', async () => {
        if (callbackUrl == null || consumer == null) return
        const bluetail = new Bluetail(invalidAppCredential)

        await expect(
          bluetail.oauth1.getRequestToken(consumer, callbackUrl)
        ).rejects.toThrow(
          'Twitter API returned errors: Could not authenticate you.'
        )
      })

      it('should throws error for invalid consumer key', async () => {
        if (callbackUrl == null || appCredential == null) return
        const bluetail = new Bluetail(appCredential)

        await expect(
          bluetail.oauth1.getRequestToken(invalidConsumer, callbackUrl)
        ).rejects.toThrow(
          'Twitter API returned HTTP 401: Could not authenticate you.'
        )
      })

      it('should throws error for invalid callback url', async () => {
        if (consumer == null || appCredential == null) return
        const bluetail = new Bluetail(appCredential)

        await expect(
          bluetail.oauth1.getRequestToken(
            consumer,
            'https://example.com/invalid_callback'
          )
        ).rejects.toThrow(
          'Twitter API returned HTTP 403: Callback URL not approved for this client application. Approved callback URLs can be adjusted in your application settings'
        )
      })
    })

    describe('getAuthorizeUrl', () => {
      it('should return authorize url', () => {
        const bluetail = new Bluetail(invalidAppCredential)

        const url = bluetail.oauth1.getAuthorizeUrl({
          key: 'request_token_key',
          secret: 'request_token_secret'
        })

        expect(url).toEqual(
          'https://api.twitter.com/oauth/authorize?oauth_token=request_token_key'
        )
      })
    })

    describe('getAuthenticateUrl', () => {
      it('should return authenticate url', () => {
        const bluetail = new Bluetail(invalidAppCredential)

        const url = bluetail.oauth1.getAuthenticateUrl({
          key: 'request_token_key',
          secret: 'request_token_secret'
        })

        expect(url).toEqual(
          'https://api.twitter.com/oauth/authenticate?oauth_token=request_token_key'
        )
      })
    })
  })
})
