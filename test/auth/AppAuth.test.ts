import { AppAuth } from '../../src'

describe('AppAuth', () => {
  describe('toHeader', () => {
    it('should build Authorization header', () => {
      expect(new AppAuth('abc').toHeaders()).toEqual({
        Authorization: 'Bearer abc'
      })
    })
  })
})
