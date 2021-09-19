import { OAuthEndpoint } from './OAuthEndpoint'

const oauth2 = {
  getBearerToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth2/token',
    payloadType: 'UrlEncodedForm'
  }),
  invalidateBearerToken: new OAuthEndpoint({
    method: 'POST',
    path: 'oauth2/invalidate_token'
  })
} as const

export { oauth2 }
