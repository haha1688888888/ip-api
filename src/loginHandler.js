const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
]

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function extractCSRFToken(html, csrfFieldName = 'csrf_token') {
  const patterns = [
    new RegExp(`<input[^>]+name=["']${csrfFieldName}["'][^>]+value=["']([^"']+)["']`, 'i'),
    new RegExp(`name=["']${csrfFieldName}["'][^>]+value=["']([^"']+)["']`, 'i'),
    new RegExp(`value=["']([^"']+)["'][^>]+name=["']${csrfFieldName}["']`, 'i')
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return null
}

function parseCookies(headers) {
  const cookies = {}
  const setCookie = headers.get('set-cookie')
  if (setCookie) {
    const parts = setCookie.split(';')[0].split('=')
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts[1].trim()
    }
  }
  return cookies
}

function formatCookies(cookieObj) {
  return Object.entries(cookieObj)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
}

export class LoginHandler {
  constructor(config) {
    this.config = config
  }

  async login(maxRetries = 3, timeoutMs = 30000) {
    const { LOGIN_URL, USERNAME, PASSWORD, USERNAME_FIELD, PASSWORD_FIELD, CSRF_FIELD, SUCCESS_INDICATOR } = this.config

    if (!LOGIN_URL || !USERNAME || !PASSWORD) {
      return {
        success: false,
        error: 'Missing required configuration: LOGIN_URL, USERNAME, or PASSWORD'
      }
    }

    let lastError = null
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Login attempt ${attempt + 1}/${maxRetries} for ${LOGIN_URL}`)
        const result = await this._attemptLogin(LOGIN_URL, USERNAME, PASSWORD, USERNAME_FIELD, PASSWORD_FIELD, CSRF_FIELD, SUCCESS_INDICATOR, timeoutMs)
        if (result.success) {
          return result
        }
        lastError = result.error
      } catch (error) {
        lastError = error.message
        console.error(`Attempt ${attempt + 1} failed:`, error)
      }
    }

    return {
      success: false,
      error: lastError || 'Login failed after maximum retries'
    }
  }

  async _attemptLogin(loginUrl, username, password, usernameField, passwordField, csrfField, successIndicator, timeoutMs) {
    const cookies = {}

    // Step 1: GET request to login page
    console.log('Step 1: Fetching login page...')
    const getResponse = await this._fetch(loginUrl, {
      method: 'GET',
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    }, timeoutMs)

    if (!getResponse.ok) {
      return {
        success: false,
        error: `Failed to fetch login page: ${getResponse.status} ${getResponse.statusText}`
      }
    }

    const html = await getResponse.text()
    const responseCookies = parseCookies(getResponse.headers)
    Object.assign(cookies, responseCookies)

    // Step 2: Extract CSRF token
    console.log('Step 2: Extracting CSRF token...')
    let csrfToken = null
    if (csrfField && csrfField !== 'none') {
      csrfToken = extractCSRFToken(html, csrfField)
      console.log('CSRF token found:', !!csrfToken)
    }

    // Step 3: Prepare form data
    console.log('Step 3: Preparing form submission...')
    const formData = new URLSearchParams()
    formData.append(usernameField, username)
    formData.append(passwordField, password)
    if (csrfToken) {
      formData.append(csrfField, csrfToken)
    }

    // Step 4: POST request with login credentials
    console.log('Step 4: Submitting login form...')
    const postResponse = await this._fetch(loginUrl, {
      method: 'POST',
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': formatCookies(cookies)
      },
      body: formData.toString(),
      redirect: 'follow'
    }, timeoutMs)

    const postCookies = parseCookies(postResponse.headers)
    Object.assign(cookies, postCookies)

    const responseBody = await postResponse.text()

    // Step 5: Verify login success
    console.log('Step 5: Verifying login success...')
    const isSuccessful = this._verifyLoginSuccess(responseBody, postResponse.status, successIndicator)

    return {
      success: isSuccessful,
      statusCode: postResponse.status,
      error: isSuccessful ? null : 'Login verification failed: success indicator not found'
    }
  }

  _verifyLoginSuccess(responseBody, statusCode, successIndicator) {
    if (!successIndicator) {
      return statusCode >= 200 && statusCode < 300
    }

    // Check for numeric status code pattern
    if (!isNaN(successIndicator)) {
      return parseInt(successIndicator) === statusCode
    }

    // Check for text content
    return responseBody.includes(successIndicator)
  }

  async _fetch(url, options, timeoutMs) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }
}
