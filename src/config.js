// Configuration for universal login keepalive worker
export const DEFAULT_CONFIG = {
  SUCCESS_INDICATOR: 'logged in',
  USERNAME_FIELD: 'username',
  PASSWORD_FIELD: 'password',
  CSRF_FIELD: 'csrf_token',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000
}

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}