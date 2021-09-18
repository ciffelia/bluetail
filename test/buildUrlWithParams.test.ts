import { buildUrlWithParams } from '../src/buildUrlWithParams'

describe('buildUrlWithParams', () => {
  it('should return URL with parameters', () => {
    expect(
      buildUrlWithParams('https://example.com/example', {
        hello: 'world',
        foo: 'bar&baz'
      })
    ).toEqual('https://example.com/example?hello=world&foo=bar%26baz')
  })

  it('should return URL without parameters', () => {
    expect(buildUrlWithParams('https://example.com/example')).toEqual(
      'https://example.com/example'
    )
  })

  it('should replace parameters in URL', () => {
    expect(
      buildUrlWithParams('https://example.com/example/:id/:action', {
        id: '123',
        action: 'run',
        hello: 'world',
        foo: 'bar&baz'
      })
    ).toEqual('https://example.com/example/123/run?hello=world&foo=bar%26baz')
  })
})
