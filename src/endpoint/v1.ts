import { V1Endpoint } from './V1Endpoint'

/**
 * v1 API endpoints
 *
 * @see {@link https://developer.twitter.com/en/docs/twitter-api}
 */
const v1 = {
  account: {
    /**
     * `GET account/verify_credentials` endpoint
     *
     * @see {@link https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials}
     */
    verifyCredentials: new V1Endpoint({
      method: 'GET',
      path: 'account/verify_credentials'
    })
  },
  tweet: {
    /**
     * `GET statuses/show/:id` endpoint
     *
     * @see {@link https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-show-id}
     */
    show: new V1Endpoint({
      method: 'GET',
      path: 'statuses/show/:id'
    })
  }
} as const

export { v1 }
