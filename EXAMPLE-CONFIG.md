# 配置示例

本文档提供了几个常见网站的登录配置示例。

## 通用步骤

1. 在管理界面填入登录网址、用户名和密码
2. 点击"🧪 测试登录"进行测试
3. 查看错误信息（如有），根据网站特点调整配置
4. 测试成功后点击"💾 保存配置"

## 获取登录表单字段名

大多数网站使用标准的 `username` 和 `password` 字段名。如果不确定，可以：

1. 在浏览器中打开登录页面
2. 右键选择"检查元素"打开开发者工具
3. 查找 `<input>` 标签的 `name` 属性

例如：
```html
<input type="text" name="user_email">
<input type="password" name="user_password">
<input type="hidden" name="_csrf">
```

对应的配置为：
- USERNAME_FIELD: `user_email`
- PASSWORD_FIELD: `user_password`
- CSRF_FIELD: `_csrf`

## 获取 CSRF Token 字段名

CSRF token 可能有不同的字段名称：
- `csrf_token` (常见)
- `_token` (Laravel)
- `_csrf` (Symfony)
- `authenticity_token` (Rails)
- 如果网站不需要，输入 `none`

## 登录成功标志

选择一个能够确认登录成功的标志：

### 选项 1: 检查页面内容
访问登录页面提交成功后，页面中会包含特定的文本。例如：
- "dashboard"（仪表板）
- "欢迎"
- "已登录"
- 用户名本身

### 选项 2: 检查 HTTP 状态码
某些网站在登录后会返回特定的状态码：
- "200" - 成功（通常）
- "301" - 重定向到仪表板

## 具体示例

### 示例 1: 简单的登录表单

网站特点：
- 使用标准的 username/password
- 有 CSRF token
- 登录成功后页面包含 "dashboard"

配置：
```
LOGIN_URL: https://example.com/login
USERNAME: admin@example.com
PASSWORD: password123
SUCCESS_INDICATOR: dashboard
USERNAME_FIELD: username
PASSWORD_FIELD: password
CSRF_FIELD: csrf_token
```

### 示例 2: Laravel 应用

网站特点：
- Laravel 框架
- CSRF token 字段名为 `_token`
- 登录后重定向到首页

配置：
```
LOGIN_URL: https://example.com/login
USERNAME: user@example.com
PASSWORD: password123
SUCCESS_INDICATOR: 200
USERNAME_FIELD: email
PASSWORD_FIELD: password
CSRF_FIELD: _token
```

### 示例 3: 无 CSRF 保护的网站

网站特点：
- 不使用 CSRF 保护
- 登录表单简单
- 成功后页面包含 "Welcome"

配置：
```
LOGIN_URL: https://example.com/login
USERNAME: testuser
PASSWORD: password123
SUCCESS_INDICATOR: Welcome
USERNAME_FIELD: username
PASSWORD_FIELD: password
CSRF_FIELD: none
```

### 示例 4: 自定义字段名

网站特点：
- 使用自定义的字段名
- 登录成功后状态码为 200

配置：
```
LOGIN_URL: https://example.com/user/login
USERNAME: admin
PASSWORD: secret
SUCCESS_INDICATOR: 200
USERNAME_FIELD: user_name
PASSWORD_FIELD: user_pass
CSRF_FIELD: security_token
```

## 故障排除

### 问题 1: "登录失败：success indicator not found"

这意味着系统无法确认登录成功。尝试：

1. 手动访问登录页面，查看登录后的页面内容
2. 查找一个在登录前不会出现、登录后一定会出现的文本
3. 使用浏览器开发者工具的网络标签，查看登录请求的响应

### 问题 2: "无法提取 CSRF token"

如果页面中没有预期的 CSRF token：

1. 检查字段名是否正确
2. 确认网站是否真的需要 CSRF token
3. 尝试设置 CSRF_FIELD 为 `none`

### 问题 3: 登录超时

如果登录超时（timeout）：

1. 增加 TIMEOUT_MS 值（默认 30000 毫秒）
2. 检查网络连接
3. 检查登录网址是否可访问

### 问题 4: 登录成功但被立即登出

某些网站可能有额外的验证步骤：

1. 检查是否需要二次验证或邮件确认
2. 检查 IP 地址是否被限制
3. 查看网站的安全设置

## 调试技巧

1. **使用 Webhook 捕获详细信息**：
   ```
   WEBHOOK_URL: https://webhook.site/unique-id
   ```
   这样可以看到完整的请求体和错误信息

2. **查看 Worker 日志**：
   ```bash
   npx wrangler tail
   ```

3. **逐步调整配置**：
   - 先尝试最基本的配置
   - 逐个添加高级设置
   - 每次只改一个参数

4. **使用测试按钮**：
   在测试成功之前，不要点击"保存配置"

## 通知配置示例

### NotifyX 示例

```
NOTIFYX_TOKEN: your_token_here
NOTIFYX_ENDPOINT: https://api.notifyx.com/send
```

登录成功或失败时，将发送通知到 NotifyX

### Webhook 示例

```
WEBHOOK_URL: https://your-server.com/webhook/login
```

将接收如下 JSON 数据：
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

## 安全建议

1. **不要在配置中硬编码密码**：
   - 将密码通过 Web 界面输入
   - 使用环境变量时确保 `.env` 文件在 `.gitignore` 中

2. **使用专用账户**：
   - 为登录保活创建专用的账户
   - 不要使用主管理员账户

3. **定期更换密码**：
   - 遵循安全最佳实践
   - 定期更新密码配置

4. **监控登录失败**：
   - 配置通知以便及时了解失败情况
   - 定期检查登录历史

## 高级配置

### 重试策略

```
MAX_RETRIES: 5
TIMEOUT_MS: 60000
```

- 增加重试次数以提高成功率
- 增加超时时间以应对较慢的网站

### 定时任务频率

编辑 `wrangler.toml`:
```toml
[[triggers.scheduled]]
crons = ["0 */4 * * *"]  # 每 4 小时
```

常见频率：
- `0 * * * *` - 每小时一次（最频繁）
- `0 */6 * * *` - 每 6 小时一次（默认）
- `0 0 * * *` - 每天一次
- `0 0 * * 0` - 每周一次

## 获取帮助

如果仍有问题：

1. 检查 Worker 日志：`npx wrangler tail`
2. 使用 Webhook 捕获详细错误信息
3. 在浏览器控制台检查 API 响应
4. 查看网站的源代码和开发者工具

