# Cloudflare Workers 部署指南
# Cloudflare Workers Deployment Guide

本文档详细说明如何将 ip-api 部署到 Cloudflare Workers。
This document provides detailed instructions for deploying ip-api to Cloudflare Workers.

## 前置要求 / Prerequisites

1. **Cloudflare 账户** / Cloudflare Account
   - 注册地址 / Sign up: https://dash.cloudflare.com/sign-up

2. **Node.js 环境** / Node.js Environment
   - 推荐版本 / Recommended: Node.js 18+ 或 20+
   - 包管理器 / Package Manager: npm 或 pnpm

## 部署方式 / Deployment Methods

### 方式一：自动化部署 (GitHub Actions) / Method 1: Automated Deployment (GitHub Actions)

这是推荐的部署方式，可以实现自动化持续部署。
This is the recommended method for automated continuous deployment.

#### 步骤 / Steps:

1. **获取 Cloudflare API Token**
   
   访问 / Visit: https://dash.cloudflare.com/profile/api-tokens
   
   点击 "Create Token" 并选择 "Edit Cloudflare Workers" 模板
   Click "Create Token" and select the "Edit Cloudflare Workers" template
   
   或创建自定义 token 并授予以下权限 / Or create a custom token with these permissions:
   - Account > Workers Scripts > Edit
   - Account > Account Settings > Read

2. **获取 Account ID**
   
   访问 / Visit: https://dash.cloudflare.com/
   
   选择任意域名，在右侧边栏可以找到 Account ID
   Select any domain, find Account ID in the right sidebar

3. **配置 GitHub Secrets**
   
   在你的 GitHub 仓库中：
   In your GitHub repository:
   
   Settings → Secrets and variables → Actions → New repository secret
   
   添加以下 secrets / Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: 你的 API Token
   - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

4. **触发部署 / Trigger Deployment**
   
   推送代码到 `master` 或 `deploy-ip-api-cloudflare-workers` 分支
   Push code to `master` or `deploy-ip-api-cloudflare-workers` branch
   
   或在 Actions 页面手动触发 "Deploy to Cloudflare Workers" workflow
   Or manually trigger the "Deploy to Cloudflare Workers" workflow in the Actions tab

### 方式二：本地部署 / Method 2: Local Deployment

#### 快速部署 / Quick Deployment:

```bash
# 1. 安装依赖 / Install dependencies
pnpm install
# 或 / or
npm install

# 2. 登录 Cloudflare / Login to Cloudflare
npx wrangler login

# 3. 部署 / Deploy
npm run deploy:cloudflare
```

#### 使用部署脚本 / Using Deployment Script:

我们提供了一个自动化部署脚本，会检查环境并引导你完成部署：
We provide an automated deployment script that checks your environment and guides you through the process:

```bash
./deploy-cloudflare.sh
```

#### 使用环境变量认证 / Authentication with Environment Variables:

适用于 CI/CD 环境或不想使用浏览器登录：
Suitable for CI/CD environments or when you don't want to use browser login:

```bash
# 设置环境变量 / Set environment variables
export CLOUDFLARE_API_TOKEN='your-api-token-here'
export CLOUDFLARE_ACCOUNT_ID='your-account-id-here'

# 部署 / Deploy
npm run deploy:cloudflare
```

## 验证部署 / Verify Deployment

部署成功后，你可以通过以下方式验证：
After successful deployment, you can verify by:

1. **访问 Workers 默认 URL / Access Workers Default URL**
   ```
   https://ip-api.<your-subdomain>.workers.dev
   ```

2. **测试 API 端点 / Test API Endpoints**
   
   获取 IP / Get IP:
   ```bash
   curl https://ip-api.<your-subdomain>.workers.dev
   ```
   
   获取地理位置信息 / Get Geo Information:
   ```bash
   curl https://ip-api.<your-subdomain>.workers.dev/geo
   ```

3. **检查响应头 / Check Response Headers**
   ```bash
   curl -I https://ip-api.<your-subdomain>.workers.dev
   # 应该看到 x-client-ip 响应头 / Should see x-client-ip header
   ```

## 绑定自定义域名 / Bind Custom Domain

1. 登录 Cloudflare Dashboard / Login to Cloudflare Dashboard
   https://dash.cloudflare.com/

2. 进入 Workers & Pages / Navigate to Workers & Pages

3. 选择你的 Worker (ip-api) / Select your Worker (ip-api)

4. 点击 "Settings" → "Triggers" → "Add Custom Domain"

5. 输入你的域名并保存 / Enter your domain and save

## 配置说明 / Configuration

### wrangler.toml

项目的 Cloudflare Workers 配置文件：
Cloudflare Workers configuration file:

```toml
name = "ip-api"
main = "src/index.js"
compatibility_date = "2023-11-24"
```

你可以根据需要修改：
You can modify as needed:

- `name`: Worker 的名称 / Worker name
- `main`: 入口文件 / Entry file
- `compatibility_date`: 兼容性日期 / Compatibility date

更多配置选项请参考：
For more configuration options, see:
https://developers.cloudflare.com/workers/wrangler/configuration/

## 故障排除 / Troubleshooting

### 认证失败 / Authentication Failed

```
You are not authenticated. Please run `wrangler login`.
```

**解决方案 / Solution:**
1. 运行 `npx wrangler login` 并在浏览器中完成认证
   Run `npx wrangler login` and complete authentication in browser
2. 或设置环境变量 `CLOUDFLARE_API_TOKEN`
   Or set environment variable `CLOUDFLARE_API_TOKEN`

### 部署权限错误 / Deployment Permission Error

```
Error: You do not have permission to deploy to this account
```

**解决方案 / Solution:**
- 确认你的 API Token 有正确的权限
  Verify your API Token has correct permissions
- 确认 Account ID 正确
  Verify Account ID is correct

### Worker 无法访问 / Worker Not Accessible

**解决方案 / Solution:**
1. 检查 Cloudflare Dashboard 确认 Worker 已部署
   Check Cloudflare Dashboard to confirm Worker is deployed
2. 等待几分钟让 DNS 传播
   Wait a few minutes for DNS propagation
3. 检查 Worker 的路由配置
   Check Worker route configuration

## 参考资料 / References

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [API Tokens 管理](https://dash.cloudflare.com/profile/api-tokens)

## 成本说明 / Cost Information

Cloudflare Workers 提供免费套餐：
Cloudflare Workers provides a free tier:

- 每天 100,000 次请求 / 100,000 requests per day
- 每个请求 10ms CPU 时间 / 10ms CPU time per request

对于大多数个人项目来说，免费套餐已经足够。
For most personal projects, the free tier is sufficient.

详细定价：https://developers.cloudflare.com/workers/platform/pricing/
