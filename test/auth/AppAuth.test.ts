import { AppAuth } from '../../src/auth/AppAuth'

describe('AppAuth', () => {
  describe('toHeader', () => {
    it('should build Authorization header', () => {
      expect(new AppAuth('abc').toHeaders()).toEqual({
        Authorization: 'Bearer abc'
      })
    })
  })
})
