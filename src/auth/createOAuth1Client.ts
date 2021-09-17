import crypto from 'crypto'
import OAuth1 from 'oauth-1.0a'
import { KeyPair } from './KeyPair'

const createOAuth1Client = (consumer: KeyPair): OAuth1 =>
  new OAuth1({
    consumer,
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) =>
      crypto.createHmac('sha1', key).update(baseString).digest('base64')
  })

export { createOAuth1Client }
