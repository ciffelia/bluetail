import { Endpoint } from './Endpoint'
import { PayloadType } from '../PayloadType'

class V2Endpoint implements Endpoint {
  constructor(private readonly property: V2EndpointProperty) {}

  method(): string {
    return this.property.method
  }

  url(): string {
    return `https://api.twitter.com/2/${this.path()}`
  }

  payloadType(): PayloadType {
    return this.property.payloadType
  }

  path(): string {
    return this.property.path
  }
}

interface V2EndpointProperty {
  method: string
  path: string
  payloadType: PayloadType
}

export { V2Endpoint, V2EndpointProperty }
