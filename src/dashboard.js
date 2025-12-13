export function generateDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>通用登录保活系统</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
      color: #333;
      font-size: 18px;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }

    .status-box {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .status-icon {
      font-size: 32px;
    }

    .status-info h3 {
      color: #333;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .status-time {
      color: #999;
      font-size: 12px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      color: #333;
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 13px;
    }

    input[type="text"],
    input[type="password"],
    input[type="url"],
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 13px;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    input[type="text"]:focus,
    input[type="password"]:focus,
    input[type="url"]:focus,
    textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-danger {
      background: #ff6b6b;
      color: white;
      flex: 0 1 auto;
    }

    .btn-danger:hover {
      background: #ee5a52;
    }

    .logs-container {
      max-height: 400px;
      overflow-y: auto;
    }

    .log-entry {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .log-entry:last-child {
      border-bottom: none;
    }

    .log-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .log-content {
      flex: 1;
    }

    .log-time {
      color: #999;
      font-size: 11px;
      display: block;
      margin-bottom: 3px;
    }

    .log-message {
      color: #333;
      margin-bottom: 3px;
    }

    .log-error {
      color: #ff6b6b;
      font-size: 12px;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 40px 20px;
      font-size: 14px;
    }

    .alert {
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-size: 13px;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #999;
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid #f0f0f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }

    .tab-button {
      padding: 10px 15px;
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.3s;
    }

    .tab-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .field-hint {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 22px;
      }

      .button-group {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔐 通用登录保活系统</h1>
      <p class="subtitle">自动化网站登录保活，支持灵活配置和多种通知方式</p>
    </header>

    <div class="grid">
      <!-- Status Card -->
      <div class="card">
        <h2>当前状态</h2>
        <div id="statusContainer" class="loading">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>

      <!-- Config Card -->
      <div class="card">
        <h2>基本配置</h2>
        <form id="configForm">
          <div class="form-group">
            <label for="loginUrl">登录网址 *</label>
            <input type="url" id="loginUrl" name="loginUrl" placeholder="https://example.com/login" required>
            <div class="field-hint">访问此地址进行登录</div>
          </div>

          <div class="form-group">
            <label for="username">用户名 *</label>
            <input type="text" id="username" name="username" placeholder="输入用户名" required>
          </div>

          <div class="form-group">
            <label for="password">密码 *</label>
            <input type="password" id="password" name="password" placeholder="输入密码" required>
          </div>

          <div class="button-group">
            <button type="submit" class="btn-primary">💾 保存配置</button>
            <button type="button" class="btn-secondary" onclick="testLogin()">🧪 测试登录</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Advanced Settings and Logs -->
    <div class="grid">
      <div class="card">
        <h2>高级配置</h2>
        <div class="tabs">
          <button type="button" class="tab-button active" onclick="switchTab(event, 'advanced')">高级设置</button>
          <button type="button" class="tab-button" onclick="switchTab(event, 'notifications')">通知设置</button>
        </div>

        <!-- Advanced Settings Tab -->
        <div id="advanced" class="tab-content active">
          <form id="advancedForm">
            <div class="form-group">
              <label for="successIndicator">登录成功标志</label>
              <input type="text" id="successIndicator" name="successIndicator" placeholder="logged in 或 200 (HTTP状态码)">
              <div class="field-hint">用于验证登录是否成功。可以是页面中的文本或HTTP状态码</div>
            </div>

            <div class="form-group">
              <label for="usernameField">用户名字段名</label>
              <input type="text" id="usernameField" name="usernameField" placeholder="username" value="username">
              <div class="field-hint">登录表单中用户名输入框的name属性</div>
            </div>

            <div class="form-group">
              <label for="passwordField">密码字段名</label>
              <input type="text" id="passwordField" name="passwordField" placeholder="password" value="password">
              <div class="field-hint">登录表单中密码输入框的name属性</div>
            </div>

            <div class="form-group">
              <label for="csrfField">CSRF字段名</label>
              <input type="text" id="csrfField" name="csrfField" placeholder="csrf_token" value="csrf_token">
              <div class="field-hint">如果网站不需要CSRF token，输入"none"</div>
            </div>

            <div class="form-group">
              <label for="interval">执行间隔（小时）</label>
              <input type="text" id="interval" name="interval" placeholder="6" value="6">
              <div class="field-hint">定时任务执行的间隔时间</div>
            </div>

            <button type="submit" class="btn-primary">💾 保存高级设置</button>
          </form>
        </div>

        <!-- Notifications Tab -->
        <div id="notifications" class="tab-content">
          <form id="notificationsForm">
            <div class="form-group">
              <label>NotifyX 通知</label>
              <div class="checkbox-group">
                <input type="checkbox" id="enableNotifyx" name="enableNotifyx">
                <label for="enableNotifyx" style="margin: 0; font-weight: normal;">启用 NotifyX</label>
              </div>
            </div>

            <div id="notifyxFields" style="display: none;">
              <div class="form-group">
                <label for="notifyxToken">NotifyX Token</label>
                <input type="password" id="notifyxToken" name="notifyxToken" placeholder="输入 NotifyX token">
              </div>

              <div class="form-group">
                <label for="notifyxEndpoint">NotifyX Endpoint</label>
                <input type="url" id="notifyxEndpoint" name="notifyxEndpoint" placeholder="https://api.notifyx.com/send">
              </div>
            </div>

            <div class="form-group">
              <label>Webhook 通知</label>
              <div class="checkbox-group">
                <input type="checkbox" id="enableWebhook" name="enableWebhook">
                <label for="enableWebhook" style="margin: 0; font-weight: normal;">启用 Webhook</label>
              </div>
            </div>

            <div id="webhookFields" style="display: none;">
              <div class="form-group">
                <label for="webhookUrl">Webhook URL</label>
                <input type="url" id="webhookUrl" name="webhookUrl" placeholder="https://your-webhook-endpoint.com/notify">
                <div class="field-hint">将接收 POST 请求，包含登录结果信息</div>
              </div>
            </div>

            <button type="submit" class="btn-primary">💾 保存通知设置</button>
          </form>
        </div>
      </div>

      <!-- Logs Card -->
      <div class="card">
        <h2>登录历史</h2>
        <div id="logsContainer" class="loading">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <button type="button" class="btn-secondary" onclick="clearLogs()" style="margin-top: 15px; width: 100%;">🗑️ 清除历史</button>
      </div>
    </div>
  </div>

  <script>
    // Tab switching
    function switchTab(event, tabName) {
      event.preventDefault()
      
      const buttons = event.target.parentElement.querySelectorAll('.tab-button')
      const contents = event.target.parentElement.parentElement.querySelectorAll('.tab-content')
      
      buttons.forEach(b => b.classList.remove('active'))
      contents.forEach(c => c.classList.remove('active'))
      
      event.target.classList.add('active')
      document.getElementById(tabName).classList.add('active')
    }

    // Notification checkbox handlers
    document.getElementById('enableNotifyx')?.addEventListener('change', (e) => {
      document.getElementById('notifyxFields').style.display = e.target.checked ? 'block' : 'none'
    })

    document.getElementById('enableWebhook')?.addEventListener('change', (e) => {
      document.getElementById('webhookFields').style.display = e.target.checked ? 'block' : 'none'
    })

    // Load initial data
    async function loadStatus() {
      try {
        const response = await fetch('/api/status')
        const data = await response.json()
        
        const statusContainer = document.getElementById('statusContainer')
        const lastLogin = data.lastLogin
        
        if (lastLogin) {
          const time = new Date(lastLogin.timestamp).toLocaleString()
          const icon = lastLogin.success ? '✅' : '❌'
          const status = lastLogin.success ? '成功' : '失败'
          
          statusContainer.innerHTML = \`
            <div class="status-box">
              <div class="status-icon">\${icon}</div>
              <div class="status-info">
                <h3>上次登录: \${status}</h3>
                <div class="status-time">\${time}</div>
                \${lastLogin.error ? \`<div class="status-time">\${lastLogin.error}</div>\` : ''}
              </div>
            </div>
          \`
        } else {
          statusContainer.innerHTML = '<div class="empty-state">暂无登录记录</div>'
        }
      } catch (error) {
        console.error('Error loading status:', error)
        document.getElementById('statusContainer').innerHTML = '<div class="alert alert-error">加载状态失败</div>'
      }
    }

    async function loadLogs() {
      try {
        const response = await fetch('/api/logs')
        const data = await response.json()
        const logsContainer = document.getElementById('logsContainer')
        
        if (!data.logs || data.logs.length === 0) {
          logsContainer.innerHTML = '<div class="empty-state">暂无登录历史</div>'
          return
        }

        logsContainer.innerHTML = \`
          <div class="logs-container">
            \${data.logs.map(log => {
              const time = new Date(log.timestamp).toLocaleString()
              const icon = log.success ? '✅' : '❌'
              const errorMsg = log.error ? \`<div class="log-error">\${log.error}</div>\` : ''
              return \`
                <div class="log-entry">
                  <div class="log-icon">\${icon}</div>
                  <div class="log-content">
                    <span class="log-time">\${time}</span>
                    <div class="log-message">\${log.success ? '登录成功' : '登录失败'}</div>
                    \${errorMsg}
                  </div>
                </div>
              \`
            }).join('')}
          </div>
        \`
      } catch (error) {
        console.error('Error loading logs:', error)
        document.getElementById('logsContainer').innerHTML = '<div class="alert alert-error">加载历史失败</div>'
      }
    }

    async function loadConfig() {
      try {
        const response = await fetch('/api/config')
        const data = await response.json()
        const config = data.config || {}

        // Load basic config
        if (config.LOGIN_URL) document.getElementById('loginUrl').value = config.LOGIN_URL
        if (config.USERNAME) document.getElementById('username').value = config.USERNAME
        if (config.PASSWORD) document.getElementById('password').value = config.PASSWORD

        // Load advanced config
        if (config.SUCCESS_INDICATOR) document.getElementById('successIndicator').value = config.SUCCESS_INDICATOR
        if (config.USERNAME_FIELD) document.getElementById('usernameField').value = config.USERNAME_FIELD
        if (config.PASSWORD_FIELD) document.getElementById('passwordField').value = config.PASSWORD_FIELD
        if (config.CSRF_FIELD) document.getElementById('csrfField').value = config.CSRF_FIELD
        if (config.INTERVAL) document.getElementById('interval').value = config.INTERVAL

        // Load notification config
        if (config.NOTIFYX_TOKEN) {
          document.getElementById('enableNotifyx').checked = true
          document.getElementById('notifyxFields').style.display = 'block'
          document.getElementById('notifyxToken').value = config.NOTIFYX_TOKEN
        }
        if (config.NOTIFYX_ENDPOINT) {
          document.getElementById('notifyxEndpoint').value = config.NOTIFYX_ENDPOINT
        }
        if (config.WEBHOOK_URL) {
          document.getElementById('enableWebhook').checked = true
          document.getElementById('webhookFields').style.display = 'block'
          document.getElementById('webhookUrl').value = config.WEBHOOK_URL
        }
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }

    // Form submissions
    document.getElementById('configForm')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const config = {
        LOGIN_URL: document.getElementById('loginUrl').value,
        USERNAME: document.getElementById('username').value,
        PASSWORD: document.getElementById('password').value
      }

      try {
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        })

        if (response.ok) {
          showAlert('基本配置已保存！', 'success')
        } else {
          showAlert('保存失败，请重试', 'error')
        }
      } catch (error) {
        showAlert('保存失败：' + error.message, 'error')
      }
    })

    document.getElementById('advancedForm')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const config = {
        SUCCESS_INDICATOR: document.getElementById('successIndicator').value,
        USERNAME_FIELD: document.getElementById('usernameField').value,
        PASSWORD_FIELD: document.getElementById('passwordField').value,
        CSRF_FIELD: document.getElementById('csrfField').value,
        INTERVAL: document.getElementById('interval').value
      }

      try {
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        })

        if (response.ok) {
          showAlert('高级配置已保存！', 'success')
        } else {
          showAlert('保存失败，请重试', 'error')
        }
      } catch (error) {
        showAlert('保存失败：' + error.message, 'error')
      }
    })

    document.getElementById('notificationsForm')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const config = {}

      if (document.getElementById('enableNotifyx').checked) {
        config.NOTIFYX_TOKEN = document.getElementById('notifyxToken').value
        config.NOTIFYX_ENDPOINT = document.getElementById('notifyxEndpoint').value
      }

      if (document.getElementById('enableWebhook').checked) {
        config.WEBHOOK_URL = document.getElementById('webhookUrl').value
      }

      try {
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        })

        if (response.ok) {
          showAlert('通知设置已保存！', 'success')
        } else {
          showAlert('保存失败，请重试', 'error')
        }
      } catch (error) {
        showAlert('保存失败：' + error.message, 'error')
      }
    })

    async function testLogin() {
      try {
        const loginUrl = document.getElementById('loginUrl').value
        if (!loginUrl) {
          showAlert('请先输入登录网址', 'error')
          return
        }

        const button = event.target
        button.disabled = true
        button.innerHTML = '测试中...'

        const response = await fetch('/api/test-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            LOGIN_URL: loginUrl,
            USERNAME: document.getElementById('username').value,
            PASSWORD: document.getElementById('password').value
          })
        })

        const result = await response.json()

        if (result.success) {
          showAlert('✅ 登录测试成功！', 'success')
          loadStatus()
          loadLogs()
        } else {
          showAlert('❌ 登录测试失败：' + result.error, 'error')
        }
      } catch (error) {
        showAlert('测试失败：' + error.message, 'error')
      } finally {
        const button = event.target
        button.disabled = false
        button.innerHTML = '🧪 测试登录'
      }
    }

    async function clearLogs() {
      if (!confirm('确定要清除所有登录历史吗？')) return

      try {
        const response = await fetch('/api/logs', { method: 'DELETE' })
        if (response.ok) {
          showAlert('历史已清除', 'success')
          loadLogs()
        } else {
          showAlert('清除失败', 'error')
        }
      } catch (error) {
        showAlert('清除失败：' + error.message, 'error')
      }
    }

    function showAlert(message, type) {
      const alertDiv = document.createElement('div')
      alertDiv.className = \`alert alert-\${type}\`
      alertDiv.textContent = message
      document.querySelector('header').appendChild(alertDiv)

      setTimeout(() => alertDiv.remove(), 4000)
    }

    // Initial load
    loadStatus()
    loadLogs()
    loadConfig()

    // Refresh data periodically
    setInterval(loadStatus, 30000)
    setInterval(loadLogs, 30000)
  </script>
</body>
</html>`
}
