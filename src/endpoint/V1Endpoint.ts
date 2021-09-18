import { Endpoint } from './Endpoint'
import { PayloadType } from './PayloadType'

class V1Endpoint implements Endpoint {
  constructor(private readonly property: V1EndpointProperty) {}

  method(): string {
    return this.property.method
  }

  url(): string {
    return `https://${this.subdomain()}.twitter.com/1.1/${this.path()}.json`
  }

  payloadType(): PayloadType {
    return this.property.payloadType ?? 'None'
  }

  subdomain(): string {
    return this.property.subdomain ?? 'api'
  }

  path(): string {
    return this.property.path
  }
}

interface V1EndpointProperty {
  subdomain?: string
  method: string
  path: string
  payloadType?: PayloadType
}

export { V1Endpoint, V1EndpointProperty }
