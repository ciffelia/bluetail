import { V1Endpoint } from './V1Endpoint'

const v1 = {
  account: {
    verifyCredentials: new V1Endpoint({
      method: 'GET',
      path: 'account/verify_credentials'
    })
  },
  tweet: {
    show: new V1Endpoint({
      method: 'GET',
      path: 'statuses/show/:id'
    })
  }
} as const

export { v1 }
