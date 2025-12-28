#!/bin/bash

echo "🍌 启动 Banana AI 开发环境..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    exit 1
fi

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  警告: 未找到 MongoDB，请确保 MongoDB 正在运行"
fi

echo "📦 检查依赖..."

# 检查后端依赖
if [ ! -d "backend/node_modules" ]; then
    echo "📥 安装后端依赖..."
    cd backend && npm install && cd ..
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📥 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ 依赖检查完成"
echo ""
echo "🚀 启动服务..."
echo "   后端: http://localhost:3000"
echo "   前端: http://localhost:8080"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务"
echo ""

# 启动服务
npm run dev

