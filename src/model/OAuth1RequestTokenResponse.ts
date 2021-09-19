interface OAuth1RequestTokenResponse {
  oauth_token: string
  oauth_token_secret: string

  // This value is always "true": https://oauth.net/core/1.0a/#rfc.section.6.1.2
  oauth_callback_confirmed: 'true'
}

export { OAuth1RequestTokenResponse }
