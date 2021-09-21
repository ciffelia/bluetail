import { KeyPair, AppAuthCredential, UserAuthCredential } from '../../src'

const invalidBearerToken = 'invalid_bearer_token'
const invalidConsumer: KeyPair = {
  key: 'invalid_consumer_key',
  secret: 'invalid_consumer_secret'
}
const invalidAccessToken: KeyPair = {
  key: 'invalid_access_token_key',
  secret: 'invalid_access_token_secret'
}

const invalidAppCredential = new AppAuthCredential(invalidBearerToken)
const invalidUserCredential = new UserAuthCredential(
  invalidConsumer,
  invalidAccessToken
)

export {
  invalidBearerToken,
  invalidConsumer,
  invalidAccessToken,
  invalidAppCredential,
  invalidUserCredential
}
