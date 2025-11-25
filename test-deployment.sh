#!/bin/bash

# 部署验证脚本 / Deployment Verification Script
# 此脚本验证部署所需的所有文件和配置是否正确
# This script verifies all files and configurations needed for deployment are correct

set -e

echo "🔍 验证 Cloudflare Workers 部署配置..."
echo "🔍 Verifying Cloudflare Workers deployment configuration..."
echo ""

# 检查必需文件
# Check required files
echo "📁 检查必需文件 / Checking required files..."
REQUIRED_FILES=(
    "package.json"
    "wrangler.toml"
    "src/index.js"
    "src/config.js"
    "src/utils.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        exit 1
    fi
done
echo ""

# 检查 wrangler.toml 配置
# Check wrangler.toml configuration
echo "⚙️  检查 wrangler.toml 配置 / Checking wrangler.toml configuration..."
if grep -q "name = \"ip-api\"" wrangler.toml; then
    echo "  ✅ Worker name configured"
fi
if grep -q "main = \"src/index.js\"" wrangler.toml; then
    echo "  ✅ Main entry point configured"
fi
if grep -q "compatibility_date" wrangler.toml; then
    echo "  ✅ Compatibility date configured"
fi
echo ""

# 检查 package.json 脚本
# Check package.json scripts
echo "📦 检查 package.json 脚本 / Checking package.json scripts..."
if grep -q "\"deploy:cloudflare\"" package.json; then
    echo "  ✅ deploy:cloudflare script found"
fi
if grep -q "wrangler" package.json; then
    echo "  ✅ wrangler dependency found"
fi
echo ""

# 检查依赖
# Check dependencies
echo "🔗 检查依赖 / Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules installed"
    if [ -f "node_modules/.bin/wrangler" ]; then
        echo "  ✅ wrangler CLI available"
    fi
else
    echo "  ⚠️  node_modules not installed - run 'pnpm install' or 'npm install'"
fi
echo ""

# 验证源代码
# Verify source code
echo "📝 验证源代码 / Verifying source code..."
if grep -q "export default" src/index.js; then
    echo "  ✅ Worker export found"
fi
if grep -q "fetch" src/index.js; then
    echo "  ✅ Fetch handler found"
fi
if grep -q "CORS_HEADERS" src/config.js; then
    echo "  ✅ CORS configuration found"
fi
echo ""

# 检查 GitHub Actions workflow
# Check GitHub Actions workflow
echo "🤖 检查 GitHub Actions workflow / Checking GitHub Actions workflow..."
if [ -f ".github/workflows/deploy-cloudflare.yml" ]; then
    echo "  ✅ deploy-cloudflare.yml workflow found"
    if grep -q "CLOUDFLARE_API_TOKEN" .github/workflows/deploy-cloudflare.yml; then
        echo "  ✅ API token placeholder configured"
    fi
    if grep -q "CLOUDFLARE_ACCOUNT_ID" .github/workflows/deploy-cloudflare.yml; then
        echo "  ✅ Account ID placeholder configured"
    fi
else
    echo "  ⚠️  GitHub Actions workflow not found"
fi
echo ""

# 检查部署脚本
# Check deployment script
echo "🚀 检查部署脚本 / Checking deployment script..."
if [ -f "deploy-cloudflare.sh" ] && [ -x "deploy-cloudflare.sh" ]; then
    echo "  ✅ deploy-cloudflare.sh is executable"
else
    echo "  ⚠️  deploy-cloudflare.sh not found or not executable"
fi
echo ""

# 检查文档
# Check documentation
echo "📚 检查文档 / Checking documentation..."
if [ -f "DEPLOYMENT.md" ]; then
    echo "  ✅ DEPLOYMENT.md found"
fi
if [ -f "README.md" ]; then
    echo "  ✅ README.md found"
fi
echo ""

echo "✅ 所有检查完成！/ All checks completed!"
echo ""
echo "📋 下一步 / Next steps:"
echo "  1. 确保已安装依赖: pnpm install 或 npm install"
echo "     Ensure dependencies installed: pnpm install or npm install"
echo ""
echo "  2. 选择部署方式 / Choose deployment method:"
echo "     a) GitHub Actions: 配置 secrets 并推送代码"
echo "        GitHub Actions: Configure secrets and push code"
echo "     b) 本地部署: 运行 ./deploy-cloudflare.sh"
echo "        Local deployment: Run ./deploy-cloudflare.sh"
echo ""
echo "  3. 查看详细文档: cat DEPLOYMENT.md"
echo "     View detailed docs: cat DEPLOYMENT.md"
echo ""
