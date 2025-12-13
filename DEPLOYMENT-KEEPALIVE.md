# 通用登录保活系统 - 部署指南

## 概览

这是一个运行在 Cloudflare Workers 上的通用网站登录保活系统，可以自动定期访问任意网站进行登录操作，保持登录状态，支持灵活配置和多种通知方式。

## 功能特性

- ✅ **通用表单登录**：支持任意网站的登录，自动处理 CSRF token
- ✅ **前端管理界面**：美观的 Web 仪表板，可视化配置和查看登录状态
- ✅ **灵活配置管理**：通过 Web 界面或环境变量配置，支持多个网站
- ✅ **自动定时执行**：使用 Cloudflare 的 Cron Triggers 自动执行定时任务
- ✅ **登录历史记录**：完整的登录日志，存储在 Cloudflare KV 中
- ✅ **多种通知方式**：支持 NotifyX 和 Webhook 两种通知方式
- ✅ **错误处理和重试**：支持配置重试次数和超时时间

## 前置要求

- Cloudflare 账户
- `wrangler` CLI 工具（v3.0+）
- Node.js 和 pnpm（推荐）

## 安装和部署

### 1. 克隆或更新代码

```bash
git clone <repository-url>
cd universal-login-keepalive
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置 wrangler.toml

编辑 `wrangler.toml` 文件，配置必要的环境变量和 KV 命名空间：

```toml
name = "universal-login-keepalive"
main = "src/index.js"
compatibility_date = "2023-11-24"

[env.production]
name = "universal-login-keepalive"
kv_namespaces = [
  { binding = "LOGIN_KV", id = "your-kv-namespace-id", preview_id = "your-preview-id" }
]

[[triggers.scheduled]]
crons = ["0 */6 * * *"]  # 每 6 小时执行一次

[vars]
LOGIN_URL = "https://example.com/login"
USERNAME = "your-username"
PASSWORD = "your-password"
SUCCESS_INDICATOR = "logged in"
USERNAME_FIELD = "username"
PASSWORD_FIELD = "password"
CSRF_FIELD = "csrf_token"
NOTIFYX_TOKEN = ""
NOTIFYX_ENDPOINT = ""
WEBHOOK_URL = ""
MAX_RETRIES = "3"
TIMEOUT_MS = "30000"
```

### 4. 创建 KV 命名空间

```bash
# 创建生产环境 KV 命名空间
npx wrangler kv:namespace create "LOGIN_KV" --preview false

# 记下返回的 namespace ID，更新到 wrangler.toml
```

### 5. 登录 Cloudflare

```bash
npx wrangler login
```

### 6. 部署到 Cloudflare Workers

```bash
# 部署到生产环境
npx wrangler deploy --env production

# 或部署到默认环境
npx wrangler deploy
```

部署成功后，您会获得一个类似以下格式的 URL：
```
https://universal-login-keepalive.your-account.workers.dev
```

## 配置说明

### 基本配置项

| 配置项 | 说明 | 示例 | 必需 |
|-------|------|------|------|
| LOGIN_URL | 登录网址 | https://example.com/login | ✅ |
| USERNAME | 用户名 | admin | ✅ |
| PASSWORD | 密码 | password123 | ✅ |
| SUCCESS_INDICATOR | 登录成功标志 | logged in 或 200 | ✅ |
| USERNAME_FIELD | 用户名字段名 | username | ✅ |
| PASSWORD_FIELD | 密码字段名 | password | ✅ |
| CSRF_FIELD | CSRF token 字段名 | csrf_token 或 none | ✅ |

### 高级配置项

| 配置项 | 说明 | 默认值 |
|-------|------|--------|
| MAX_RETRIES | 最大重试次数 | 3 |
| TIMEOUT_MS | 请求超时时间（毫秒） | 30000 |
| INTERVAL | 定时任务执行间隔（小时） | 6 |

### 通知配置项

#### NotifyX 通知
```
NOTIFYX_TOKEN = "your-notifyx-token"
NOTIFYX_ENDPOINT = "https://api.notifyx.com/send"
```

#### Webhook 通知
```
WEBHOOK_URL = "https://your-webhook-endpoint.com/notify"
```

Webhook 会接收 POST 请求，包含以下数据：
```json
{
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "username": "admin",
  "loginUrl": "https://example.com/login",
  "message": "登录成功",
  "errorDetails": null
}
```

## 使用方法

### 访问管理界面

打开浏览器访问部署后的 Workers URL：
```
https://universal-login-keepalive.your-account.workers.dev/
```

### 配置登录信息

1. 在管理界面的"基本配置"卡片中填入：
   - 登录网址
   - 用户名
   - 密码

2. 点击"🧪 测试登录"按钮测试配置是否正确

3. 如果测试成功，点击"💾 保存配置"保存配置

### 配置高级选项

在"高级配置"标签页中：
- 设置登录成功的验证标志
- 自定义表单字段名称（如果网站使用非标准字段名）
- 配置 CSRF token 字段名称

### 配置通知

在"通知设置"标签页中：
- 启用 NotifyX 并填入相关信息
- 启用 Webhook 并填入 Webhook URL

### 查看登录历史

在"登录历史"卡片中可以查看：
- 最近的登录尝试
- 登录是否成功
- 错误信息（如有）

## 定时任务配置

### 修改执行间隔

编辑 `wrangler.toml` 中的 cron 表达式：

```toml
[[triggers.scheduled]]
crons = ["0 */6 * * *"]  # 每 6 小时执行一次
```

常见的 cron 表达式：
- `0 * * * *` - 每小时执行一次
- `0 */6 * * *` - 每 6 小时执行一次
- `0 0 * * *` - 每天午夜执行一次
- `0 0 * * 0` - 每周日午夜执行一次

### 手动触发

在管理界面点击"🧪 测试登录"按钮可以手动触发一次登录尝试。

## API 端点

### 获取状态
```
GET /api/status

Response:
{
  "success": true,
  "lastLogin": {
    "success": true,
    "timestamp": 1640000000000,
    "username": "admin",
    "loginUrl": "https://example.com/login",
    "message": "登录成功",
    "error": null
  }
}
```

### 获取登录日志
```
GET /api/logs

Response:
{
  "success": true,
  "logs": [...]
}
```

### 清除登录日志
```
DELETE /api/logs

Response:
{
  "success": true
}
```

### 获取配置
```
GET /api/config

Response:
{
  "success": true,
  "config": {
    "LOGIN_URL": "...",
    "USERNAME": "...",
    ...
  }
}
```

### 保存配置
```
POST /api/config

Request Body:
{
  "LOGIN_URL": "https://example.com/login",
  "USERNAME": "admin",
  ...
}

Response:
{
  "success": true,
  "message": "Configuration saved successfully"
}
```

### 测试登录
```
POST /api/test-login

Request Body:
{
  "LOGIN_URL": "https://example.com/login",
  "USERNAME": "admin",
  "PASSWORD": "password123"
}

Response:
{
  "success": true,
  "username": "admin",
  "loginUrl": "https://example.com/login",
  "message": "登录成功",
  "statusCode": 200
}
```

## 常见问题

### Q: 如何在登录时跳过 CSRF token 验证？
A: 在"CSRF 字段名"配置中输入 `none`，系统会跳过 CSRF token 的提取和提交。

### Q: 如何验证登录是否成功？
A: 可以配置两种方式：
1. 输入特定的文本内容（例如 "logged in"）
2. 输入 HTTP 状态码（例如 "200"）

### Q: 登录历史会保留多长时间？
A: 系统最多保留最近的 100 条登录记录。

### Q: 如何在多个网站上同时使用？
A: 目前系统设计为单网站单 Worker。如果需要多网站支持，可以：
1. 为每个网站部署一个独立的 Worker
2. 使用相同的代码库，但不同的 wrangler 配置

### Q: 如何安全地存储密码？
A: 密码存储在 Cloudflare KV 中，受 Cloudflare 的安全保护。不建议在前端显示密码。

### Q: 如何处理登录失败的情况？
A: 系统会自动重试（可配置重试次数），并通过通知方式（NotifyX/Webhook）报告失败情况。

## 安全建议

1. **保护 KV 数据**：确保 KV 命名空间的访问权限正确配置
2. **使用 HTTPS**：所有登录请求都应通过 HTTPS 进行
3. **避免在日志中显示密码**：系统已做到这一点，确保前端也不显示密码
4. **定期更换密码**：遵循安全最佳实践
5. **使用 Webhook 时保护端点**：确保 Webhook 端点有适当的认证

## 故障排除

### 登录失败

1. 检查登录网址是否正确
2. 验证用户名和密码是否正确
3. 在"测试登录"中查看详细错误信息
4. 检查网站是否需要特殊的 User-Agent 或 Cookie

### 通知未发送

1. 检查 NotifyX/Webhook 配置是否完整
2. 查看 Cloudflare Worker 日志中的错误信息
3. 确保 Webhook 端点可访问且返回 2xx 状态码

### 配置未保存

1. 检查浏览器控制台中的错误信息
2. 确保 KV 命名空间已正确配置
3. 检查网络连接是否正常

## 监控和日志

### 查看 Worker 日志

```bash
# 查看实时日志
npx wrangler tail

# 查看特定时间段的日志
npx wrangler tail --start 2024-01-01
```

### 在管理界面查看日志

登录管理界面后，在"登录历史"卡片中可以查看所有登录尝试的记录。

## 更新和维护

### 更新代码

```bash
# 拉取最新代码
git pull origin main

# 重新部署
npx wrangler deploy --env production
```

### 检查 Worker 统计信息

在 Cloudflare Dashboard 中可以查看：
- Worker 请求数量
- 错误率
- CPU 时间
- 带宽使用

## 支持和贡献

如遇到问题，请：
1. 检查本文档的常见问题部分
2. 查看 Cloudflare Worker 日志
3. 提交 Issue 报告问题
4. 提交 Pull Request 贡献改进

## 许可证

MIT
