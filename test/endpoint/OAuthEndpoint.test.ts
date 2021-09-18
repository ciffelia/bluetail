import { OAuthEndpoint } from '../../src'

describe('OAuthEndpoint', () => {
  const endpoint = new OAuthEndpoint({
    method: 'POST',
    path: 'oauth2/token'
  })

  it('should return method', () => {
    expect(endpoint.method()).toEqual('POST')
  })

  it('should return url', () => {
    expect(endpoint.url()).toEqual('https://api.twitter.com/oauth2/token')
  })

  it('should return payload type', () => {
    expect(endpoint.payloadType()).toEqual('None')
  })

  it('should return path', () => {
    expect(endpoint.path()).toEqual('oauth2/token')
  })
})
