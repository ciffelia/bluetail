import { TwitterError } from '../../src'

describe('TwitterError', () => {
  const error = new TwitterError({
    httpStatus: 401,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body: {
      errors: [{ code: 89, message: 'Invalid or expired token.' }]
    }
  })

  describe('httpStatus', () => {
    it('should return HTTP status code', () => {
      expect(error.httpStatus).toEqual(401)
    })
  })

  describe('headers', () => {
    it('should return headers', () => {
      expect(error.headers).toEqual({
        'content-type': 'application/json; charset=utf-8'
      })
    })
  })

  describe('errors', () => {
    it('should return the list of error codes', () => {
      expect(error.errors).toEqual([
        { code: 89, message: 'Invalid or expired token.' }
      ])
    })
  })

  describe('name', () => {
    it(`should return 'TwitterError'`, () => {
      expect(error.name).toEqual('TwitterError')
    })
  })

  describe('message', () => {
    it(`should return error message`, () => {
      expect(error.message).toEqual(
        'Twitter API returned HTTP 401: Invalid or expired token.'
      )
    })
  })
})
