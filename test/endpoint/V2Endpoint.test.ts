import { V2Endpoint } from '../../src/endpoint/V2Endpoint'

describe('V2Endpoint', () => {
  const endpoint = new V2Endpoint({
    method: 'POST',
    path: 'users/6253282/following',
    payloadType: 'JSON'
  })

  it('should return method', async () => {
    expect(endpoint.method()).toEqual('POST')
  })

  it('should return url', async () => {
    expect(endpoint.url()).toEqual(
      'https://api.twitter.com/2/users/6253282/following'
    )
  })

  it('should return payload type', async () => {
    expect(endpoint.payloadType()).toEqual('JSON')
  })

  it('should return path', async () => {
    expect(endpoint.path()).toEqual('users/6253282/following')
  })
})
