export class NotificationHandler {
  constructor(config) {
    this.config = config
  }

  async sendNotification(result) {
    const { success, username, loginUrl, message, errorDetails } = result

    const notificationResults = {
      notifyx: null,
      webhook: null
    }

    // Send NotifyX notification
    if (this.config.NOTIFYX_TOKEN && this.config.NOTIFYX_ENDPOINT) {
      try {
        const notifyxResult = await this.sendNotifyX(success, username, loginUrl, message, errorDetails)
        notificationResults.notifyx = notifyxResult
      } catch (error) {
        console.error('NotifyX notification error:', error)
        notificationResults.notifyx = { error: error.message }
      }
    }

    // Send Webhook notification
    if (this.config.WEBHOOK_URL) {
      try {
        const webhookResult = await this.sendWebhook(success, username, loginUrl, message, errorDetails)
        notificationResults.webhook = webhookResult
      } catch (error) {
        console.error('Webhook notification error:', error)
        notificationResults.webhook = { error: error.message }
      }
    }

    return notificationResults
  }

  async sendNotifyX(success, username, loginUrl, message, errorDetails) {
    const { NOTIFYX_TOKEN, NOTIFYX_ENDPOINT } = this.config

    const title = success ? '✅ 登录成功' : '❌ 登录失败'
    const content = `
用户: ${username}
网址: ${loginUrl}
时间: ${new Date().toLocaleString()}
${success ? '' : `错误: ${errorDetails || message}`}
    `.trim()

    const payload = {
      token: NOTIFYX_TOKEN,
      title,
      content,
      type: success ? 'success' : 'error'
    }

    const response = await fetch(NOTIFYX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`NotifyX API error: ${response.status} ${response.statusText}`)
    }

    return { success: true, statusCode: response.status }
  }

  async sendWebhook(success, username, loginUrl, message, errorDetails) {
    const { WEBHOOK_URL } = this.config

    const payload = {
      success,
      timestamp: new Date().toISOString(),
      username,
      loginUrl,
      message,
      errorDetails: success ? null : errorDetails
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`)
    }

    return { success: true, statusCode: response.status }
  }
}
