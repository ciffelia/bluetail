import { Endpoint } from './Endpoint'
import { PayloadType } from './PayloadType'

class OAuthEndpoint implements Endpoint {
  constructor(private readonly property: OAuthEndpointProperty) {}

  method(): string {
    return this.property.method
  }

  url(): string {
    return `https://api.twitter.com/${this.path()}`
  }

  payloadType(): PayloadType {
    return 'None'
  }

  path(): string {
    return this.property.path
  }
}

interface OAuthEndpointProperty {
  method: string
  path: string
}

export { OAuthEndpoint, OAuthEndpointProperty }
