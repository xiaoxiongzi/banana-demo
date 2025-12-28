# 快速启动指南

本指南帮助您快速启动改造后的 Banana AI 后端服务（腾讯云 MySQL + COS 版本）。

## 前置要求

- ✅ Node.js >= 14.x 已安装
- ✅ 已有腾讯云账号
- ✅ 已创建腾讯云 MySQL 实例
- ✅ 已创建腾讯云 COS 存储桶
- ✅ 已获取腾讯云 API 密钥

## 快速开始（5 分钟）

### 步骤 1: 安装依赖

```bash
cd backend
npm install
```

### 步骤 2: 配置环境变量

创建 `.env` 文件：

```bash
# 复制以下内容到 .env 文件

# 基础配置
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=5242880
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# MySQL 配置（填写你的实际配置）
MYSQL_HOST=your-mysql-host.tencentcdb.com
MYSQL_PORT=3306
MYSQL_DATABASE=banana_ai
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_mysql_password

# COS 配置（填写你的实际配置）
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
COS_BUCKET=your-bucket-name-appid
COS_REGION=ap-guangzhou
COS_BASE_URL=https://your-bucket-name-appid.cos.ap-guangzhou.myqcloud.com
```

### 步骤 3: 创建数据库

连接到你的 MySQL 实例，执行：

```sql
CREATE DATABASE IF NOT EXISTS banana_ai 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 步骤 4: 启动应用

```bash
# 开发模式（带热重载）
npm run dev

# 或生产模式
npm start
```

看到以下输出说明启动成功：

```
✅ MySQL 连接成功
✅ 数据库模型同步完成
🚀 服务器运行在 http://localhost:3000
```

### 步骤 5: 测试 API

访问健康检查接口：

```bash
curl http://localhost:3000/health
```

预期响应：

```json
{
  "status": "ok",
  "message": "Banana AI API is running"
}
```

## 验证功能

### 1. 测试用户注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. 测试用户登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

保存返回的 `token`，后续请求需要使用。

### 3. 测试图片上传（需要 token）

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "images=@/path/to/your/image.jpg"
```

成功后会返回 COS 的图片 URL。

### 4. 测试获取模型列表

```bash
curl http://localhost:3000/api/generate/models
```

## 常见问题排查

### ❌ MySQL 连接失败

**错误信息**：
```
❌ MySQL 连接失败: connect ECONNREFUSED
```

**解决方法**：
1. 检查 `MYSQL_HOST` 和 `MYSQL_PORT` 是否正确
2. 确认 MySQL 实例已启动
3. 检查安全组规则是否允许访问
4. 验证用户名和密码

### ❌ 数据库不存在

**错误信息**：
```
Unknown database 'banana_ai'
```

**解决方法**：
```sql
CREATE DATABASE banana_ai;
```

### ❌ COS 上传失败

**错误信息**：
```
COS 上传失败: The specified bucket does not exist
```

**解决方法**：
1. 检查 `COS_BUCKET` 名称是否正确（包含 APPID）
2. 确认存储桶已创建
3. 验证 `COS_REGION` 是否正确
4. 检查 `TENCENT_SECRET_ID` 和 `TENCENT_SECRET_KEY`

### ❌ 图片无法访问

**问题**：图片上传成功但无法通过 URL 访问

**解决方法**：
1. 确认存储桶访问权限设置为"公有读私有写"
2. 检查 `COS_BASE_URL` 配置是否正确
3. 尝试在浏览器直接访问 COS URL

### ❌ 端口被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方法**：
```bash
# 方法 1: 修改端口
PORT=3001 npm run dev

# 方法 2: 杀死占用端口的进程
lsof -ti:3000 | xargs kill -9
```

## 数据库表自动创建

首次启动时，Sequelize 会自动创建以下表：

- ✅ `users` - 用户表
- ✅ `orders` - 订单表
- ✅ `generation_histories` - 生成历史表
- ✅ `redeem_codes` - 兑换码表

可以连接到 MySQL 查看：

```sql
USE banana_ai;
SHOW TABLES;
```

## 下一步

1. 📖 阅读 [ENV_CONFIG.md](./ENV_CONFIG.md) 了解详细配置
2. 📖 阅读 [README.md](./README.md) 了解完整 API 文档
3. 📖 阅读 [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) 了解改造详情
4. 🔧 根据实际需求调整配置和代码
5. 🚀 部署到生产环境

## 开发建议

### 推荐的开发工具

- **API 测试**: Postman 或 Insomnia
- **数据库管理**: MySQL Workbench 或 DBeaver
- **COS 管理**: 腾讯云控制台或 COSBrowser 客户端

### 开发模式特性

运行 `npm run dev` 时：
- 代码变更自动重启（nodemon）
- 数据库 SQL 查询日志输出到控制台
- 详细的错误堆栈信息

### 调试技巧

```bash
# 启用详细日志
DEBUG=* npm run dev

# 仅启动不自动重启
node src/app.js
```

## 性能优化建议

### 1. 数据库连接池

当前配置：
```javascript
pool: {
  max: 10,      // 最大连接数
  min: 0,       // 最小连接数
  acquire: 30000, // 获取连接超时时间
  idle: 10000   // 空闲连接超时时间
}
```

根据实际负载调整这些参数。

### 2. 文件上传限制

当前限制：5MB

修改 `.env`:
```bash
MAX_FILE_SIZE=10485760  # 10MB
```

### 3. COS 访问优化

建议配置 CDN 加速：
1. 在腾讯云 CDN 控制台创建加速域名
2. 绑定到 COS 存储桶
3. 更新 `COS_BASE_URL` 为 CDN 域名

## 生产环境部署

### 环境变量配置

```bash
NODE_ENV=production
JWT_SECRET=use_a_very_strong_random_secret_here
```

### 启动命令

```bash
npm start
```

或使用 PM2：

```bash
npm install -g pm2
pm2 start src/app.js --name banana-api
```

### 安全检查清单

- [ ] 使用强 JWT_SECRET
- [ ] MySQL 使用强密码
- [ ] 限制 MySQL 访问 IP
- [ ] COS 使用子账号密钥
- [ ] 启用 HTTPS
- [ ] 配置防火墙规则
- [ ] 定期备份数据库

## 获取帮助

- 📚 查看项目文档：[README.md](./README.md)
- 📚 配置指南：[ENV_CONFIG.md](./ENV_CONFIG.md)
- 📚 改造说明：[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- 🌐 腾讯云文档：https://cloud.tencent.com/document
- 💬 提交 Issue：[项目 GitHub 仓库]

---

祝您使用愉快！🎉


