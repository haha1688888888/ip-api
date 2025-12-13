# 通用登录保活系统

## 简介

这是一个运行在 Cloudflare Workers 上的通用网站自动登录保活系统。它可以：

- 🔐 自动定期访问任意网站进行登录
- 📊 提供美观的 Web 管理界面来配置和监控
- 📧 支持 NotifyX 和 Webhook 多种通知方式
- 💾 使用 Cloudflare KV 存储配置和登录历史
- ⏰ 支持灵活的定时任务配置
- 🔄 智能处理 CSRF token 和 Cookie 管理
- 📝 完整的错误处理和日志记录

## 快速开始

### 1. 部署

```bash
# 克隆项目
git clone <repo-url>
cd universal-login-keepalive

# 安装依赖
pnpm install

# 创建 KV 命名空间
npx wrangler kv:namespace create "LOGIN_KV"

# 更新 wrangler.toml 中的 KV namespace ID

# 部署
npx wrangler deploy
```

### 2. 访问管理界面

部署成功后，访问 Worker URL（如 `https://your-worker.workers.dev/`）即可看到管理界面。

### 3. 配置登录信息

在管理界面的"基本配置"部分：
1. 输入登录网址（如 `https://example.com/login`）
2. 输入用户名和密码
3. 点击"🧪 测试登录"验证配置
4. 配置成功后点击"💾 保存配置"

### 4. 配置高级选项（可选）

在"高级配置"标签页中：
- 修改登录成功的验证标志（默认为页面中包含 "logged in"）
- 自定义表单字段名称（默认为 username/password）
- 配置 CSRF token 字段名称

### 5. 配置通知（可选）

在"通知设置"标签页中：
- 启用 NotifyX 并填入 token 和 endpoint
- 启用 Webhook 并填入自定义 URL

## 项目结构

```
src/
├── index.js              # 主 Worker 入口，处理所有请求和定时任务
├── dashboard.js          # 前端管理界面 HTML 生成
├── loginHandler.js       # 登录逻辑处理（CSRF、表单提交等）
├── notificationHandler.js # 通知系统（NotifyX、Webhook）
├── kvStorage.js          # Cloudflare KV 存储操作
├── config.js             # 默认配置和常量
└── utils.js              # 工具函数
```

## API 端点

| 端点 | 方法 | 说明 |
|-----|------|------|
| `/` | GET | 管理界面页面 |
| `/api/status` | GET | 获取最新登录状态 |
| `/api/logs` | GET | 获取登录历史 |
| `/api/logs` | DELETE | 清除登录历史 |
| `/api/config` | GET | 获取当前配置 |
| `/api/config` | POST | 更新配置 |
| `/api/test-login` | POST | 测试登录 |

## 配置项说明

### 必需配置

- **LOGIN_URL**: 登录网址（如 `https://example.com/login`）
- **USERNAME**: 登录用户名
- **PASSWORD**: 登录密码

### 可选配置

- **SUCCESS_INDICATOR**: 登录成功的验证标志，可以是：
  - 页面中的文本（如 "logged in"）
  - HTTP 状态码（如 "200"）
  - 默认：`logged in`

- **USERNAME_FIELD**: 登录表单中用户名输入框的 name 属性，默认：`username`
- **PASSWORD_FIELD**: 登录表单中密码输入框的 name 属性，默认：`password`
- **CSRF_FIELD**: CSRF token 字段名，如不需要则输入 `none`，默认：`csrf_token`
- **MAX_RETRIES**: 最大重试次数，默认：`3`
- **TIMEOUT_MS**: 请求超时时间（毫秒），默认：`30000`

### 通知配置

**NotifyX**:
- NOTIFYX_TOKEN: NotifyX API token
- NOTIFYX_ENDPOINT: NotifyX API endpoint（通常为 `https://api.notifyx.com/send`）

**Webhook**:
- WEBHOOK_URL: 自定义 Webhook URL，系统会发送 POST 请求

## 定时任务

默认配置在 `wrangler.toml` 中每 6 小时执行一次登录。可修改 cron 表达式来改变执行频率：

```toml
[[triggers.scheduled]]
crons = ["0 */6 * * *"]
```

常见表达式：
- `0 * * * *` - 每小时
- `0 0 * * *` - 每天
- `0 0 * * 0` - 每周日
- `*/30 * * * *` - 每 30 分钟

## 技术细节

### 登录流程

1. **GET 请求**：访问登录页面获取 HTML
2. **CSRF 提取**：从 HTML 中提取 CSRF token（如需要）
3. **POST 请求**：提交登录表单（用户名、密码、CSRF token）
4. **验证**：检查响应状态码或页面内容来判断登录是否成功
5. **重试**：失败时自动重试（最多 MAX_RETRIES 次）
6. **通知**：成功或失败都发送通知

### 数据存储

- **配置**：存储在 Cloudflare KV 中的 `config` 键
- **日志**：存储在 Cloudflare KV 中的 `logs` 键（最多 100 条）

### User-Agent 随机化

系统会为每次请求随机选择 User-Agent，避免被检测为机器人。

## 常见问题

### Q: 如何修改定时执行的频率？
A: 编辑 `wrangler.toml` 中的 `[[triggers.scheduled]]` 部分的 crons 值。

### Q: 配置是否保存在 KV 中？
A: 是的，通过 Web 界面修改的配置会保存在 KV 中，并且优先级高于环境变量。

### Q: 如何处理网站的登出问题？
A: 某些网站可能需要特殊的 Cookie 处理。系统会自动保存响应的 Cookie，但如仍无法保持登录状态，可能需要自定义登录流程。

### Q: 支持二次验证（2FA）吗？
A: 目前不支持。系统只能处理用户名/密码的简单登录。

### Q: 可以同时管理多个网站吗？
A: 目前单个 Worker 只支持一个网站。如需多个网站，需要部署多个 Worker 实例。

### Q: 密码是否安全？
A: 密码存储在 Cloudflare KV 中，由 Cloudflare 的安全基础设施保护。建议：
- 使用专门的账户（不是主账户）
- 定期更换密码
- 不要在前端 console 中显示密码

## 部署到生产环境

```bash
# 使用生产环境配置部署
npx wrangler deploy --env production
```

## 监控

### 查看 Worker 日志
```bash
npx wrangler tail
```

### 在管理界面查看状态
访问 Worker URL 的管理界面，查看：
- 最后登录时间和状态
- 完整的登录历史
- 任何错误信息

## 许可证

MIT
