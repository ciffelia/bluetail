import { PayloadType } from './PayloadType'

interface Endpoint {
  method: () => string
  url: () => string
  payloadType: () => PayloadType
}

export { Endpoint }
