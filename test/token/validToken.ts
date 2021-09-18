import { KeyPair, AppAuthCredential, UserAuthCredential } from '../../src'

const callbackUrl = process.env.TWITTER_CALLBACK_URL
const bearerToken = process.env.TWITTER_BEARER_TOKEN
let consumer: KeyPair | undefined
let accessToken: KeyPair | undefined

if (
  process.env.TWITTER_CONSUMER_KEY != null &&
  process.env.TWITTER_CONSUMER_SECRET != null
) {
  consumer = {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET
  }
}
if (
  process.env.TWITTER_ACCESS_TOKEN_KEY != null &&
  process.env.TWITTER_ACCESS_TOKEN_SECRET != null
) {
  accessToken = {
    key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
}

let appCredential: AppAuthCredential | undefined
let userCredential: UserAuthCredential | undefined

if (bearerToken != null) {
  appCredential = new AppAuthCredential(bearerToken)
}
if (consumer != null && accessToken != null) {
  userCredential = new UserAuthCredential(consumer, accessToken)
}

export {
  callbackUrl,
  bearerToken,
  consumer,
  accessToken,
  appCredential,
  userCredential
}
