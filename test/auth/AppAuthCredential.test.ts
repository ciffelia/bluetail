import { AppAuthCredential } from '../../src'

describe('AppAuthCredential', () => {
  describe('toHeader', () => {
    it('should build Authorization header', () => {
      expect(new AppAuthCredential('abc').toHeaders()).toEqual({
        Authorization: 'Bearer abc'
      })
    })
  })
})
