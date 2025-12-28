# 项目快速启动指南

## 前置条件

1. 安装 Node.js (>= 14.x)
2. 安装 MongoDB (>= 4.x)
3. 启动 MongoDB 服务

## 方式一：使用启动脚本（推荐）

### macOS/Linux
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Windows
```bash
# 手动启动，见方式二
```

## 方式二：手动启动

### 1. 安装依赖
```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 2. 配置环境变量
```bash
cd backend
cp .env.example .env
# 根据需要修改 .env 文件
```

### 3. 启动服务

#### 启动后端
```bash
cd backend
npm run dev
```
后端将运行在 http://localhost:3000

#### 启动前端（新终端窗口）
```bash
cd frontend
npm run serve
```
前端将运行在 http://localhost:8080

### 4. 访问应用
打开浏览器访问 http://localhost:8080

## 默认配置

- 后端端口: 3000
- 前端端口: 8080
- MongoDB: mongodb://localhost:27017/banana-ai
- 新用户默认积分: 100

## 测试功能

1. 注册新账号（自动获得 100 积分）
2. 登录系统
3. 在首页输入提示词生成图片
4. 查看套餐购买页面
5. 使用兑换码功能（需要管理员生成）
6. 查看个人中心和历史记录

## 常见问题

### MongoDB 连接失败
确保 MongoDB 服务正在运行：
```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# 从开始菜单启动 MongoDB 服务
```

### 端口占用
如果 3000 或 8080 端口被占用，可以修改：
- 后端: 修改 `backend/.env` 中的 PORT
- 前端: 修改 `frontend/vue.config.js` 中的 devServer.port

### 图片上传失败
确保 `backend/uploads` 目录存在且有写入权限

## 开发提示

- 后端代码修改会自动重启（nodemon）
- 前端代码修改会自动热更新
- API 请求会自动代理到后端服务
- Mock 数据延迟 2.5 秒模拟真实场景

