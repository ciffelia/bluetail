import { Endpoint } from './Endpoint'
import { PayloadType } from './PayloadType'

/**
 * Twitter OAuth API endpoint
 */
class OAuthEndpoint implements Endpoint {
  constructor(private readonly property: OAuthEndpointProperty) {}

  method(): string {
    return this.property.method
  }

  url(): string {
    return `https://api.twitter.com/${this.path()}`
  }

  payloadType(): PayloadType {
    return this.property.payloadType ?? 'None'
  }

  path(): string {
    return this.property.path
  }
}

interface OAuthEndpointProperty {
  method: string
  path: string
  payloadType?: PayloadType
}

export { OAuthEndpoint, OAuthEndpointProperty }
