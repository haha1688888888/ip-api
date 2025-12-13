import { generateDashboardHTML } from './dashboard'
import { KVStorage } from './kvStorage'
import { LoginHandler } from './loginHandler'
import { NotificationHandler } from './notificationHandler'

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url)

    // Initialize KV storage
    const kv = env.LOGIN_KV || null
    const kvStorage = new KVStorage(kv)

    // Merge environment variables with stored config
    const storedConfig = await kvStorage.getConfig() || {}
    const config = {
      LOGIN_URL: storedConfig.LOGIN_URL || env.LOGIN_URL || '',
      USERNAME: storedConfig.USERNAME || env.USERNAME || '',
      PASSWORD: storedConfig.PASSWORD || env.PASSWORD || '',
      SUCCESS_INDICATOR: storedConfig.SUCCESS_INDICATOR || env.SUCCESS_INDICATOR || 'logged in',
      USERNAME_FIELD: storedConfig.USERNAME_FIELD || env.USERNAME_FIELD || 'username',
      PASSWORD_FIELD: storedConfig.PASSWORD_FIELD || env.PASSWORD_FIELD || 'password',
      CSRF_FIELD: storedConfig.CSRF_FIELD || env.CSRF_FIELD || 'csrf_token',
      NOTIFYX_TOKEN: storedConfig.NOTIFYX_TOKEN || env.NOTIFYX_TOKEN || '',
      NOTIFYX_ENDPOINT: storedConfig.NOTIFYX_ENDPOINT || env.NOTIFYX_ENDPOINT || '',
      WEBHOOK_URL: storedConfig.WEBHOOK_URL || env.WEBHOOK_URL || '',
      MAX_RETRIES: parseInt(storedConfig.MAX_RETRIES || env.MAX_RETRIES || '3'),
      TIMEOUT_MS: parseInt(storedConfig.TIMEOUT_MS || env.TIMEOUT_MS || '30000')
    }

    // Route handlers
    if (pathname === '/') {
      return new Response(generateDashboardHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }

    if (pathname === '/api/status') {
      return await handleStatus(kvStorage)
    }

    if (pathname === '/api/logs') {
      if (request.method === 'GET') {
        return await handleGetLogs(kvStorage)
      }
      if (request.method === 'DELETE') {
        return await handleDeleteLogs(kvStorage)
      }
    }

    if (pathname === '/api/config') {
      if (request.method === 'GET') {
        return await handleGetConfig(config)
      }
      if (request.method === 'POST') {
        return await handleSetConfig(request, kvStorage)
      }
    }

    if (pathname === '/api/test-login') {
      if (request.method === 'POST') {
        return await handleTestLogin(request, kvStorage)
      }
    }

    // 404
    return new Response('Not Found', { status: 404 })
  },

  async scheduled(event, env, ctx) {
    const kv = env.LOGIN_KV || null
    const kvStorage = new KVStorage(kv)

    const storedConfig = await kvStorage.getConfig() || {}
    const config = {
      LOGIN_URL: storedConfig.LOGIN_URL || env.LOGIN_URL || '',
      USERNAME: storedConfig.USERNAME || env.USERNAME || '',
      PASSWORD: storedConfig.PASSWORD || env.PASSWORD || '',
      SUCCESS_INDICATOR: storedConfig.SUCCESS_INDICATOR || env.SUCCESS_INDICATOR || 'logged in',
      USERNAME_FIELD: storedConfig.USERNAME_FIELD || env.USERNAME_FIELD || 'username',
      PASSWORD_FIELD: storedConfig.PASSWORD_FIELD || env.PASSWORD_FIELD || 'password',
      CSRF_FIELD: storedConfig.CSRF_FIELD || env.CSRF_FIELD || 'csrf_token',
      NOTIFYX_TOKEN: storedConfig.NOTIFYX_TOKEN || env.NOTIFYX_TOKEN || '',
      NOTIFYX_ENDPOINT: storedConfig.NOTIFYX_ENDPOINT || env.NOTIFYX_ENDPOINT || '',
      WEBHOOK_URL: storedConfig.WEBHOOK_URL || env.WEBHOOK_URL || '',
      MAX_RETRIES: parseInt(storedConfig.MAX_RETRIES || env.MAX_RETRIES || '3'),
      TIMEOUT_MS: parseInt(storedConfig.TIMEOUT_MS || env.TIMEOUT_MS || '30000')
    }

    console.log('Scheduled event triggered for login keepalive')
    await performLogin(config, kvStorage)
  }
}

async function handleStatus(kvStorage) {
  try {
    const lastLogin = await kvStorage.getLastLoginStatus()
    return Response.json(
      { success: true, lastLogin },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error in handleStatus:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleGetLogs(kvStorage) {
  try {
    const logs = await kvStorage.getLogs()
    return Response.json(
      { success: true, logs },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error in handleGetLogs:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleDeleteLogs(kvStorage) {
  try {
    await kvStorage.clearLogs()
    return Response.json(
      { success: true },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error in handleDeleteLogs:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleGetConfig(config) {
  try {
    const safeConfig = {
      LOGIN_URL: config.LOGIN_URL,
      USERNAME: config.USERNAME,
      SUCCESS_INDICATOR: config.SUCCESS_INDICATOR,
      USERNAME_FIELD: config.USERNAME_FIELD,
      PASSWORD_FIELD: config.PASSWORD_FIELD,
      CSRF_FIELD: config.CSRF_FIELD,
      NOTIFYX_ENDPOINT: config.NOTIFYX_ENDPOINT,
      INTERVAL: config.INTERVAL
    }

    // Include token/secret flags without exposing the actual values
    if (config.NOTIFYX_TOKEN) {
      safeConfig.NOTIFYX_TOKEN = '***'
    }
    if (config.WEBHOOK_URL) {
      safeConfig.WEBHOOK_URL = '***'
    }

    return Response.json(
      { success: true, config: safeConfig },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error in handleGetConfig:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleSetConfig(request, kvStorage) {
  try {
    const newConfig = await request.json()
    const existingConfig = await kvStorage.getConfig() || {}

    const updatedConfig = {
      ...existingConfig,
      ...newConfig
    }

    await kvStorage.setConfig(updatedConfig)

    return Response.json(
      { success: true, message: 'Configuration saved successfully' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error in handleSetConfig:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleTestLogin(request, kvStorage) {
  try {
    const testConfig = await request.json()
    const config = {
      LOGIN_URL: testConfig.LOGIN_URL,
      USERNAME: testConfig.USERNAME,
      PASSWORD: testConfig.PASSWORD,
      SUCCESS_INDICATOR: testConfig.SUCCESS_INDICATOR || 'logged in',
      USERNAME_FIELD: testConfig.USERNAME_FIELD || 'username',
      PASSWORD_FIELD: testConfig.PASSWORD_FIELD || 'password',
      CSRF_FIELD: testConfig.CSRF_FIELD || 'csrf_token'
    }

    const loginHandler = new LoginHandler(config)
    const result = await loginHandler.login(3, 30000)

    const logEntry = {
      success: result.success,
      username: config.USERNAME,
      loginUrl: config.LOGIN_URL,
      message: result.success ? '登录成功' : result.error,
      error: result.error || null
    }

    await kvStorage.addLoginLog(logEntry)

    return Response.json(
      { ...logEntry, statusCode: result.statusCode },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Error in handleTestLogin:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function performLogin(config, kvStorage) {
  try {
    const loginHandler = new LoginHandler(config)
    const result = await loginHandler.login(config.MAX_RETRIES, config.TIMEOUT_MS)

    const logEntry = {
      success: result.success,
      username: config.USERNAME,
      loginUrl: config.LOGIN_URL,
      message: result.success ? '登录成功' : result.error,
      error: result.error || null,
      statusCode: result.statusCode
    }

    await kvStorage.addLoginLog(logEntry)

    // Send notifications
    const notificationHandler = new NotificationHandler(config)
    const notificationResults = await notificationHandler.sendNotification({
      success: result.success,
      username: config.USERNAME,
      loginUrl: config.LOGIN_URL,
      message: logEntry.message,
      errorDetails: result.error
    })

    console.log('Login attempt completed:', {
      success: result.success,
      loginUrl: config.LOGIN_URL,
      notifications: notificationResults
    })

    return {
      success: result.success,
      loginResult: logEntry,
      notifications: notificationResults
    }
  } catch (error) {
    console.error('Error in performLogin:', error)

    const logEntry = {
      success: false,
      username: config.USERNAME || 'unknown',
      loginUrl: config.LOGIN_URL || 'unknown',
      message: 'Internal error',
      error: error.message
    }

    await kvStorage.addLoginLog(logEntry)

    return {
      success: false,
      error: error.message,
      loginResult: logEntry
    }
  }
}
