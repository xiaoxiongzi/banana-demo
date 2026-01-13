# Banana AI Backend

基于 Koa 2.x + 腾讯云 MySQL + 腾讯云对象存储（COS）的 AI 图像编辑工具后端 API

## 功能特性

- 用户认证系统（注册、登录、JWT）
- 图片上传到腾讯云 COS
- AI 图片生成（Mock）并存储到 COS
- 积分系统和兑换码
- 订单管理和套餐购买
- 生成历史记录

## 技术栈

- **Web 框架**: Koa 2.x
- **数据库**: 腾讯云 MySQL + Sequelize ORM
- **文件存储**: 腾讯云对象存储（COS）
- **认证**: JWT
- **文件上传**: Multer
- **密码加密**: bcryptjs

## 架构说明

本项目使用腾讯云服务：

1. **腾讯云 MySQL**：存储用户、订单、生成历史等结构化数据
2. **腾讯云 COS**：存储所有图片文件（用户上传的图片和 AI 生成的图片）

### 数据流程

```
用户上传图片 → Multer → COS 存储 → 返回 COS URL
AI 生成图片 → 下载到内存 → COS 存储 → 返回 COS URL → 保存 URL 到 MySQL
```

## 环境要求

- Node.js >= 14.x
- 腾讯云账号
- 腾讯云 MySQL 实例
- 腾讯云 COS 存储桶

## 安装步骤

### 1. 安装依赖

```bash
yarn install
```

### 2. 配置腾讯云服务

#### 2.1 创建 MySQL 实例

1. 登录腾讯云控制台
2. 进入"云数据库 MySQL"，创建实例
3. 创建数据库：`banana_ai`
4. 配置安全组，允许应用服务器访问

#### 2.2 创建 COS 存储桶

1. 登录腾讯云控制台
2. 进入"对象存储 COS"
3. 创建存储桶，设置访问权限为"公有读私有写"
4. 配置 CORS（如果前端需要直接访问）

#### 2.3 获取 API 密钥

1. 进入"访问管理" -> "API密钥管理"
2. 创建密钥，获取 SecretId 和 SecretKey

### 3. 配置环境变量

创建 `.env` 文件并配置（详细说明请查看 [ENV_CONFIG.md](./ENV_CONFIG.md)）：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=5242880

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 腾讯云 MySQL 配置
MYSQL_HOST=your-mysql-host.tencentcdb.com
MYSQL_PORT=3306
MYSQL_DATABASE=banana_ai
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password

# 腾讯云 COS 配置
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
COS_BUCKET=your-bucket-name
COS_REGION=ap-guangzhou
COS_BASE_URL=https://your-bucket.cos.ap-guangzhou.myqcloud.com
```

### 4. 启动服务

开发模式：

```bash
yarn dev
```

生产模式：

```bash
yarn start
```

## API 端点

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 文件上传

- `POST /api/upload` - 上传图片到 COS（最多3张）
- `DELETE /api/upload` - 删除 COS 中的图片

### 图片生成

- `POST /api/generate` - 生成图片并存储到 COS
- `GET /api/generate/models` - 获取可用模型列表

### 积分系统

- `GET /api/credits` - 查询积分
- `POST /api/credits/redeem` - 兑换积分码
- `POST /api/credits/generate-code` - 生成兑换码（管理员）

### 订单管理

- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `GET /api/orders/packages/list` - 获取套餐列表

### 生成历史

- `GET /api/history` - 获取生成历史
- `GET /api/history/:id` - 获取历史详情
- `DELETE /api/history/:id` - 删除历史记录
- `GET /api/history/stats/summary` - 获取统计信息

## 项目结构

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL 数据库连接（Sequelize）
│   │   └── cos.js               # 腾讯云 COS 配置和工具函数
│   ├── middleware/
│   │   ├── auth.js              # JWT 认证中间件
│   │   └── errorHandler.js      # 错误处理中间件
│   ├── models/
│   │   ├── index.js             # 模型关联定义
│   │   ├── User.js              # 用户模型（Sequelize）
│   │   ├── Order.js             # 订单模型
│   │   ├── GenerationHistory.js # 生成历史模型
│   │   └── RedeemCode.js        # 兑换码模型
│   ├── routes/
│   │   ├── auth.js              # 认证路由
│   │   ├── upload.js            # COS 上传路由
│   │   ├── generate.js          # 生成路由（集成 COS）
│   │   ├── credits.js           # 积分路由
│   │   ├── order.js             # 订单路由
│   │   └── history.js           # 历史路由
│   ├── utils/
│   │   ├── jwt.js               # JWT 工具
│   │   └── response.js          # 响应工具
│   └── app.js                   # 应用入口
├── .env                          # 环境变量（需自行创建）
├── ENV_CONFIG.md                 # 环境变量配置详细说明
├── .gitignore
├── package.json
└── README.md
```

## 数据库表结构

应用启动时会自动创建以下表：

- `users` - 用户表
- `orders` - 订单表
- `generation_histories` - 生成历史表
- `redeem_codes` - 兑换码表

## COS 存储结构

```
存储桶/
├── uploads/          # 用户上传的原始图片
│   └── {timestamp}-{random}.jpg
└── generated/        # AI 生成的图片
    └── {timestamp}-{random}.jpg
```

## 开发说明

- 默认端口：3000
- 新注册用户默认获得 100 积分
- 图片生成使用 Mock 数据（延迟 2.5 秒）
- 支持的图片格式：JPG、PNG、WEBP
- 最大文件大小：5MB
- 所有图片文件存储在腾讯云 COS
- 图片 URL 为 COS 公开访问地址

## 与 MongoDB 版本的主要差异

1. **ORM 框架**：从 Mongoose 迁移到 Sequelize
2. **数据库**：从 MongoDB 迁移到 MySQL
3. **主键**：从 `_id`（ObjectId）改为 `id`（自增整数）
4. **数组字段**：使用 JSON 类型存储（如 `inputImages`）
5. **文件存储**：从本地文件系统迁移到腾讯云 COS
6. **静态文件服务**：移除 `koa-static`，所有文件通过 COS 访问

## 故障排查

### MySQL 连接失败

- 检查 MySQL 主机地址和端口
- 验证用户名和密码
- 确认数据库已创建
- 检查安全组规则

### COS 上传失败

- 检查 SecretId 和 SecretKey
- 确认存储桶名称和地域
- 检查存储桶权限配置
- 验证网络连接

### 图片无法访问

- 确认存储桶访问权限为"公有读"
- 检查 COS_BASE_URL 配置
- 验证文件是否成功上传

详细的配置说明和故障排查，请参考 [ENV_CONFIG.md](./ENV_CONFIG.md)

## 安全建议

1. 不要将 `.env` 文件提交到代码仓库
2. 生产环境使用强密码和复杂的 JWT_SECRET
3. 使用子账号密钥，配置最小权限策略
4. 定期备份 MySQL 数据库
5. 监控 COS 存储使用量和访问日志

## 相关文档

- [环境变量配置详细说明](./ENV_CONFIG.md)
- [腾讯云 MySQL 文档](https://cloud.tencent.com/document/product/236)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
- [Sequelize 文档](https://sequelize.org/)

## License

ISC
