import { V1Endpoint } from '../../src'

describe('V1Endpoint', () => {
  const endpoint = new V1Endpoint({
    subdomain: 'api-example',
    method: 'GET',
    path: 'account/verify_credentials',
    payloadType: 'None'
  })

  it('should return method', async () => {
    expect(endpoint.method()).toEqual('GET')
  })

  it('should return url', async () => {
    expect(endpoint.url()).toEqual(
      'https://api-example.twitter.com/1.1/account/verify_credentials.json'
    )
  })

  it('should return payload type', async () => {
    expect(endpoint.payloadType()).toEqual('None')
  })

  it('should return subdomain', async () => {
    expect(endpoint.subdomain()).toEqual('api-example')
  })

  it('should return path', async () => {
    expect(endpoint.path()).toEqual('account/verify_credentials')
  })
})
