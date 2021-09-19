import { Credential } from '../auth'

interface RequestOption {
  credential?: Credential
  params?: Record<string, any>
  headers?: Record<string, any>
  body?: unknown
}

export { RequestOption }
