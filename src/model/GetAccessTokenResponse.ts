import { KeyPair } from '../auth'

interface GetAccessTokenResponse {
  accessToken: KeyPair
  userId: string
  screenName: string
}

export { GetAccessTokenResponse }
