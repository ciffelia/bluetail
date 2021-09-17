import { buildUrlWithParams } from '../src/buildUrlWithParams'

describe('buildUrlWithParams', () => {
  it('should return url with parameters', () => {
    expect(
      buildUrlWithParams('https://example.com/example', {
        hello: 'world',
        foo: 'bar&baz'
      })
    ).toEqual('https://example.com/example?hello=world&foo=bar%26baz')
  })

  it('should return url without parameters', () => {
    expect(buildUrlWithParams('https://example.com/example')).toEqual(
      'https://example.com/example'
    )
  })
})
