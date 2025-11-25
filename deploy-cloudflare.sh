#!/bin/bash

# Cloudflare Workers 部署脚本
# Cloudflare Workers Deployment Script

set -e

echo "🚀 Starting Cloudflare Workers deployment for ip-api..."
echo ""

# 检查依赖是否已安装
# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# 检查是否已认证
# Check if authenticated
echo "🔐 Checking Cloudflare authentication..."
if ! npx wrangler whoami &> /dev/null; then
    echo "❌ Not authenticated with Cloudflare"
    echo ""
    echo "Please authenticate using one of the following methods:"
    echo ""
    echo "Method 1: Interactive login (opens browser)"
    echo "  npx wrangler login"
    echo ""
    echo "Method 2: Using API Token (recommended for CI/CD)"
    echo "  export CLOUDFLARE_API_TOKEN='your-api-token'"
    echo "  export CLOUDFLARE_ACCOUNT_ID='your-account-id'"
    echo ""
    echo "To get your API token:"
    echo "  1. Go to https://dash.cloudflare.com/profile/api-tokens"
    echo "  2. Create a token with 'Edit Cloudflare Workers' permissions"
    echo "  3. Export the token as shown above"
    echo ""
    exit 1
fi

echo "✅ Authenticated with Cloudflare"
echo ""

# 部署到 Cloudflare Workers
# Deploy to Cloudflare Workers
echo "🚢 Deploying to Cloudflare Workers..."
npm run deploy:cloudflare

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📝 Next steps:"
echo "  1. Check your Cloudflare Workers dashboard: https://dash.cloudflare.com/workers"
echo "  2. Your worker should be available at: https://ip-api.YOUR-SUBDOMAIN.workers.dev"
echo "  3. Optionally, bind a custom domain in the Cloudflare dashboard"
echo ""
