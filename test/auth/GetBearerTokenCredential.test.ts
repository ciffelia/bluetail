import { KeyPair } from '../../src'
import { GetBearerTokenCredential } from '../../src/auth'

describe('GetBearerTokenCredential', () => {
  describe('toHeader', () => {
    it('should build Authorization header', () => {
      // Example values from https://developer.twitter.com/en/docs/authentication/oauth-2-0/application-only#issuing-application-only-requests

      const consumer: KeyPair = {
        key: 'xvz1evFS4wEEPTGEFPHBog',
        secret: 'L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg'
      }

      expect(new GetBearerTokenCredential(consumer).toHeaders()).toEqual({
        Authorization:
          'Basic eHZ6MWV2RlM0d0VFUFRHRUZQSEJvZzpMOHFxOVBaeVJnNmllS0dFS2hab2xHQzB2SldMdzhpRUo4OERSZHlPZw=='
      })
    })
  })
})
