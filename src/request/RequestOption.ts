import { Credential } from '../auth'

interface RequestOption {
  credential?: Credential
  params?: Record<string, string>
  headers?: Record<string, string>
  body?: unknown
}

export { RequestOption }
