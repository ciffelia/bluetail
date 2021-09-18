import { V2Endpoint } from '../../src'

describe('V2Endpoint', () => {
  const endpoint = new V2Endpoint({
    method: 'POST',
    path: 'users/6253282/following',
    payloadType: 'JSON'
  })

  it('should return method', () => {
    expect(endpoint.method()).toEqual('POST')
  })

  it('should return url', () => {
    expect(endpoint.url()).toEqual(
      'https://api.twitter.com/2/users/6253282/following'
    )
  })

  it('should return payload type', () => {
    expect(endpoint.payloadType()).toEqual('JSON')
  })

  it('should return path', () => {
    expect(endpoint.path()).toEqual('users/6253282/following')
  })
})
