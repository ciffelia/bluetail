import OAuth1 from 'oauth-1.0a'
import { UserAuth, KeyPair, Endpoint } from '../../src'

describe('UserAuth', () => {
  beforeAll(() => {
    // @ts-expect-error
    OAuth1.prototype._getTimeStamp = OAuth1.prototype.getTimeStamp
    // @ts-expect-error
    OAuth1.prototype._getNonce = OAuth1.prototype.getNonce

    OAuth1.prototype.getTimeStamp = () => 1318622958
    OAuth1.prototype.getNonce = () =>
      'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg'
  })

  afterAll(() => {
    // @ts-expect-error
    OAuth1.prototype.getTimeStamp = OAuth1.prototype._getTimeStamp
    // @ts-expect-error
    OAuth1.prototype.getNonce = OAuth1.prototype._getNonce
    // @ts-expect-error
    delete OAuth1.prototype._getTimeStamp
    // @ts-expect-error
    delete OAuth1.prototype._getNonce
  })

  describe('toHeader', () => {
    it('should build Authorization header', () => {
      // Example from https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature

      const endpoint: Endpoint = {
        method: () => 'POST',
        url: () => 'https://api.twitter.com/1.1/statuses/update.json',
        payloadType: () => 'UrlEncodedForm'
      }
      const consumer: KeyPair = {
        key: 'xvz1evFS4wEEPTGEFPHBog',
        secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
      }
      const accessToken: KeyPair = {
        key: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
        secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
      }

      expect(
        new UserAuth(consumer, accessToken).toHeaders({
          endpoint,
          params: { include_entities: 'true' },
          body: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' }
        })
      ).toEqual({
        Authorization:
          'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="hCtSmYh%2BiHYCEqBWrE7C7hYmtUk%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"'
      })
    })
  })
})
