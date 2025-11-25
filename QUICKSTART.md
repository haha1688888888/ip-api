# 🚀 快速开始 / Quick Start

部署 ip-api 到 Cloudflare Workers 的最快方式。
Fastest way to deploy ip-api to Cloudflare Workers.

## 方式一：GitHub Actions (推荐) / Method 1: GitHub Actions (Recommended)

### 1. 获取 Cloudflare 凭证 / Get Cloudflare Credentials

**API Token:**
1. 访问 / Visit: https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 选择 "Edit Cloudflare Workers" 模板 / Select "Edit Cloudflare Workers" template
4. 复制生成的 token / Copy the generated token

**Account ID:**
1. 访问 / Visit: https://dash.cloudflare.com/
2. 选择任意域名 / Select any domain
3. 在右侧边栏找到 Account ID / Find Account ID in right sidebar

### 2. 配置 GitHub Secrets

在你的 GitHub 仓库：
In your GitHub repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

添加两个 secrets / Add two secrets:
- Name: `CLOUDFLARE_API_TOKEN`, Value: `your-api-token`
- Name: `CLOUDFLARE_ACCOUNT_ID`, Value: `your-account-id`

### 3. 触发部署 / Trigger Deployment

**选项 A: 推送代码 / Option A: Push Code**
```bash
git push origin master
```

**选项 B: 手动触发 / Option B: Manual Trigger**
1. 访问 GitHub Actions 页面
2. 选择 "Deploy to Cloudflare Workers"
3. 点击 "Run workflow"

### 4. 完成！/ Done!

部署成功后，访问：
After successful deployment, visit:
```
https://ip-api.<your-subdomain>.workers.dev
```

---

## 方式二：本地部署 / Method 2: Local Deployment

### 1. 安装依赖 / Install Dependencies
```bash
pnpm install
# 或 / or
npm install
```

### 2. 登录 Cloudflare / Login to Cloudflare
```bash
npx wrangler login
```
会打开浏览器完成认证 / Opens browser for authentication

### 3. 部署 / Deploy
```bash
npm run deploy:cloudflare
```

### 4. 完成！/ Done!

---

## 验证部署 / Verify Deployment

```bash
# 测试 IP 端点 / Test IP endpoint
curl https://ip-api.<your-subdomain>.workers.dev

# 测试 Geo 端点 / Test Geo endpoint
curl https://ip-api.<your-subdomain>.workers.dev/geo
```

## 需要帮助？/ Need Help?

查看完整文档：
See full documentation:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南 / Full deployment guide
- [README.md](./README.md) - 项目说明 / Project documentation
- [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md) - 部署总结 / Deployment summary

运行验证脚本：
Run verification script:
```bash
./test-deployment.sh
```

---

⚡ **最快路径 / Fastest Path:**
```bash
# 1. 配置 GitHub Secrets (一次性)
#    Configure GitHub Secrets (one-time)
CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID

# 2. 推送代码
#    Push code
git push

# 3. 完成！
#    Done!
```
