# MySQL 环境变量配置指南

## 环境变量配置

创建 `.env` 文件在 `backend` 目录下，并配置以下环境变量：

### 1. 服务器基础配置

```bash
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=5242880
```

### 2. JWT 认证配置

```bash
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

### 3. Google GenAI API 配置

```bash
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

**配置说明：**
- `GOOGLE_GENAI_API_KEY`: Google GenAI API 密钥，用于 AI 图片生成

### 4. MySQL 数据库配置

```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=banana_ai
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_mysql_password
```

**配置说明：**
- `MYSQL_HOST`: MySQL 服务器地址
- `MYSQL_PORT`: 默认为 3306
- `MYSQL_DATABASE`: 数据库名（如 `banana_ai`）
- `MYSQL_USERNAME`: 数据库用户名
- `MYSQL_PASSWORD`: 数据库密码

## 数据库配置步骤

### MySQL 数据库配置

1. **创建数据库**
   ```sql
   CREATE DATABASE banana_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **配置数据库连接**
   - 确保 MySQL 服务已启动
   - 配置 `.env` 文件中的数据库连接信息

## 完整 .env 配置示例

```bash
# 服务器配置
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=5242880

# JWT 配置
JWT_SECRET=banana_ai_super_secret_key_2024
JWT_EXPIRES_IN=7d

# Google GenAI API 配置
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# MySQL 配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=banana_ai
MYSQL_USERNAME=root
MYSQL_PASSWORD=YourStrongPassword123!
```

## 安全建议

1. **密钥安全**
   - 不要将 `.env` 文件提交到代码仓库
   - 使用 `.gitignore` 忽略 `.env` 文件
   - 妥善保管 API 密钥

2. **数据库安全**
   - 使用强密码
   - 限制访问 IP 白名单
   - 定期备份数据库

3. **环境隔离**
   - 开发环境和生产环境使用不同的配置
   - 不同环境使用不同的数据库

## 启动应用

配置完成后，安装依赖并启动应用：

```bash
# 安装依赖
cd backend
yarn install

# 开发模式启动
yarn dev

# 生产模式启动
yarn start
```

## 数据库表结构

应用首次启动时会自动创建所需的表结构（如果使用 `sequelize.sync()`）。表包括：

- `users` - 用户表
- `orders` - 订单表
- `generation_histories` - 生成历史表
- `redeem_codes` - 兑换码表

## 故障排查

### MySQL 连接失败

- 检查 `MYSQL_HOST` 和端口是否正确
- 验证用户名和密码是否正确
- 确认数据库是否已创建
- 检查 MySQL 服务是否已启动

### Google GenAI API 调用失败

- 检查 `GOOGLE_GENAI_API_KEY` 是否正确
- 确认 API 密钥是否有效
- 检查网络连接是否正常

## 更多帮助

- [MySQL 文档](https://dev.mysql.com/doc/)
- [Sequelize 文档](https://sequelize.org/)
- [Google GenAI 文档](https://ai.google.dev/)


