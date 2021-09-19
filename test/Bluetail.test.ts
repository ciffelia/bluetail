import { Endpoint, PayloadType, Bluetail } from '../src'
import {
  callbackUrl,
  bearerToken,
  consumer,
  appCredential,
  userCredential,
  accessToken
} from './token/validToken'
import {
  invalidBearerToken,
  invalidConsumer,
  invalidAppCredential,
  invalidUserCredential,
  invalidAccessToken
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

    describe('invalidateAccessToken', () => {
      // Normally we don't want to invalidate the access token on every test.
      it.skip('should invalidates access token', async () => {
        if (consumer == null || accessToken == null) return
        const bluetail = new Bluetail()

        await bluetail.oauth1.invalidateAccessToken(consumer, accessToken)
      })

      it('should throws error for invalid consumer key', async () => {
        if (accessToken == null) return
        const bluetail = new Bluetail()

        await expect(
          bluetail.oauth1.invalidateAccessToken(invalidConsumer, accessToken)
        ).rejects.toThrow(
          'Twitter API returned HTTP 401: Could not authenticate you.'
        )
      })

      it('should throws error for invalid access token', async () => {
        if (consumer == null) return
        const bluetail = new Bluetail()

        await expect(
          bluetail.oauth1.invalidateAccessToken(consumer, invalidAccessToken)
        ).rejects.toThrow(
          'Twitter API returned HTTP 401: Invalid or expired token.'
        )
      })
    })
  })

  describe('oauth2', () => {
    describe('getBearerToken', () => {
      it('should returns bearer token', async () => {
        if (bearerToken == null || consumer == null) return
        const bluetail = new Bluetail()

        const obtainedBearerToken = await bluetail.oauth2.getBearerToken(
          consumer
        )
        expect(obtainedBearerToken).toEqual(bearerToken)
      })

      it('should throws error for invalid consumer key', async () => {
        const bluetail = new Bluetail()

        await expect(
          bluetail.oauth2.getBearerToken(invalidConsumer)
        ).rejects.toThrow(
          'Twitter API returned HTTP 403: Unable to verify your credentials'
        )
      })
    })

    // This API seems to be broken since 2019: https://twittercommunity.com/t/oauth2-invalidate-token-not-working-with-sorry-that-page-does-not-exist-code-34-error/120646
    describe.skip('invalidateBearerToken', () => {
      // Normally we don't want to invalidate the bearer token on every test.
      it.skip('should invalidates bearer token', async () => {
        if (bearerToken == null || consumer == null || accessToken == null)
          return
        const bluetail = new Bluetail()

        await bluetail.oauth2.invalidateBearerToken(
          consumer,
          accessToken,
          bearerToken
        )
      })

      it('should throws error for invalid consumer key', async () => {
        if (bearerToken == null || accessToken == null) return
        const bluetail = new Bluetail()

        await expect(
          bluetail.oauth2.invalidateBearerToken(
            invalidConsumer,
            accessToken,
            bearerToken
          )
        ).rejects.toThrow('Twitter API returned HTTP 403: ')
      })

      it('should throws error for invalid access token', async () => {
        if (bearerToken == null || consumer == null) return
        const bluetail = new Bluetail()

        await expect(
          bluetail.oauth2.invalidateBearerToken(
            consumer,
            invalidAccessToken,
            bearerToken
          )
        ).rejects.toThrow('Twitter API returned HTTP 403: ')
      })

      // Note: the access token must be the application owner's token
      it('should throws error for invalid bearer token', async () => {
        if (consumer == null || accessToken == null) return
        const bluetail = new Bluetail()

        await expect(
          bluetail.oauth2.invalidateBearerToken(
            consumer,
            accessToken,
            invalidBearerToken
          )
        ).rejects.toThrow('Twitter API returned HTTP 403: ')
      })
    })
  })

  describe('v1', () => {
    describe('account', () => {
      describe('verifyCredentials', () => {
        it('should obtain the authorized account', async () => {
          if (userCredential == null) return
          const bluetail = new Bluetail(userCredential)

          const user = await bluetail.v1.account.verifyCredentials({
            params: { include_entities: 'false', skip_status: 'true' }
          })

          expect(user.id_str).toBeDefined()
          expect(user.statuses_count).toBeDefined()
        })

        it('should include headers', async () => {
          if (userCredential == null) return
          const bluetail = new Bluetail(userCredential)

          const user = await bluetail.v1.account.verifyCredentials({
            params: { include_entities: 'false', skip_status: 'true' }
          })

          expect(user._headers['x-rate-limit-limit']).toEqual('75')
        })
      })
    })

    describe('tweet', () => {
      describe('show', () => {
        it('should obtain a tweet with app auth', async () => {
          if (appCredential == null) return
          const bluetail = new Bluetail(appCredential)

          const tweet = await bluetail.v1.tweet.show({
            params: { id: '20' }
          })

          expect(tweet.id_str).toEqual('20')
          expect(tweet.full_text).toEqual('just setting up my twttr')
        })

        it('should obtain a tweet with user auth', async () => {
          if (userCredential == null) return
          const bluetail = new Bluetail(userCredential)

          const tweet = await bluetail.v1.tweet.show({
            params: { id: '20' }
          })

          expect(tweet.id_str).toEqual('20')
          expect(tweet.full_text).toEqual('just setting up my twttr')
        })

        it('should include headers', async () => {
          if (appCredential == null) return
          const bluetail = new Bluetail(appCredential)

          const tweet = await bluetail.v1.tweet.show({
            params: { id: '20' }
          })

          expect(tweet._headers['x-rate-limit-limit']).toEqual('900')
        })
      })
    })
  })
})
