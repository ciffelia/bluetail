import OAuth1 from 'oauth-1.0a'
import hmacSHA1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'
import { KeyPair } from './KeyPair'

const createOAuth1Client = (consumer: KeyPair): OAuth1 =>
  new OAuth1({
    consumer,
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) =>
      Base64.stringify(hmacSHA1(baseString, key))
  })

export { createOAuth1Client }
