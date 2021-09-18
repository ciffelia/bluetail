import { prepareBody } from '../../src/request/prepareBody'
import { PayloadType } from '../../src'

describe('prepareBody', () => {
  it('should return URL encoded body', () => {
    expect(
      prepareBody({ hello: 'world', foo: 'bar&baz' }, 'UrlEncodedForm')
    ).toEqual('hello=world&foo=bar%26baz')
  })

  it('should return JSON body', () => {
    expect(prepareBody({ hello: 'world', foo: 'bar&baz' }, 'JSON')).toEqual(
      '{"hello":"world","foo":"bar&baz"}'
    )
  })

  it('should throw error for invalid payload type', () => {
    expect(() => prepareBody({}, 'None')).toThrow(
      new TypeError('Body must not be set for this endpoint.')
    )
  })

  it('should throw error for unknown payload type', () => {
    expect(() => prepareBody({}, 'Unknown' as PayloadType)).toThrow(
      new TypeError('Unknown payload type: Unknown')
    )
  })
})
