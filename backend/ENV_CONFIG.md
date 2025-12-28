# 腾讯云 MySQL + COS 环境变量配置指南

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

### 3. 腾讯云 MySQL 数据库配置

在腾讯云控制台获取以下信息：
- 进入 **云数据库 MySQL** -> **实例列表**
- 点击实例 ID 查看连接信息

```bash
MYSQL_HOST=your-mysql-host.tencentcdb.com
MYSQL_PORT=3306
MYSQL_DATABASE=banana_ai
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_mysql_password
```

**配置说明：**
- `MYSQL_HOST`: 腾讯云 MySQL 实例的内网或外网地址
- `MYSQL_PORT`: 默认为 3306
- `MYSQL_DATABASE`: 需要提前在 MySQL 中创建的数据库名（如 `banana_ai`）
- `MYSQL_USERNAME`: 数据库用户名，通常为 `root`
- `MYSQL_PASSWORD`: 数据库密码

### 4. 腾讯云对象存储 COS 配置

#### 4.1 获取 API 密钥

- 进入 **访问管理** -> **API密钥管理**
- 创建密钥，获取 `SecretId` 和 `SecretKey`

#### 4.2 创建 COS 存储桶

- 进入 **对象存储** -> **存储桶列表**
- 创建存储桶，获取存储桶名称和所属地域

```bash
# 腾讯云 API 密钥
TENCENT_SECRET_ID=your_secret_id_here
TENCENT_SECRET_KEY=your_secret_key_here

# COS 存储桶配置
COS_BUCKET=banana-ai-1234567890
COS_REGION=ap-guangzhou

# COS 访问域名（可选，如不配置将自动生成）
COS_BASE_URL=https://banana-ai-1234567890.cos.ap-guangzhou.myqcloud.com
```

**配置说明：**

- `TENCENT_SECRET_ID` / `TENCENT_SECRET_KEY`: 在"访问管理-API密钥管理"中创建
- `COS_BUCKET`: 存储桶名称格式为 `{自定义名称}-{APPID}`
  - 示例：`banana-ai-1234567890`
- `COS_REGION`: 可选地域包括：
  - `ap-beijing` (北京)
  - `ap-shanghai` (上海)
  - `ap-guangzhou` (广州)
  - `ap-chengdu` (成都)
  - `ap-nanjing` (南京)
  - `ap-hongkong` (香港)
- `COS_BASE_URL`: COS 访问域名，格式为 `https://{Bucket}.cos.{Region}.myqcloud.com`

## 腾讯云控制台配置步骤

### MySQL 数据库配置

1. **创建 MySQL 实例**（如已有实例可跳过）
   - 登录腾讯云控制台
   - 进入"云数据库 MySQL"
   - 点击"新建"创建实例
   - 选择地域、规格等配置

2. **创建数据库**
   ```sql
   CREATE DATABASE banana_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **配置安全组**
   - 在实例详情页，配置安全组规则
   - 允许应用服务器的 IP 访问 MySQL 端口（3306）

4. **获取连接信息**
   - 在实例列表中，点击实例 ID
   - 查看"内网地址"或"外网地址"作为 `MYSQL_HOST`

### COS 对象存储配置

1. **创建存储桶**
   - 登录腾讯云控制台
   - 进入"对象存储 COS"
   - 点击"创建存储桶"
   - 填写存储桶名称，选择地域
   - 访问权限选择"公有读私有写"

2. **配置跨域访问 CORS**（如果前端需要直接访问）
   - 进入存储桶配置
   - 点击"安全管理" -> "跨域访问CORS设置"
   - 添加规则：
     - 来源 Origin: `*` 或指定前端域名
     - 操作 Methods: `GET, POST, PUT, DELETE, HEAD`
     - Allow-Headers: `*`
     - Expose-Headers: `ETag`

3. **获取 API 密钥**
   - 进入"访问管理" -> "API密钥管理"
   - 点击"新建密钥"
   - 保存 `SecretId` 和 `SecretKey`（只显示一次，请妥善保管）

4. **配置权限策略**（可选）
   - 为不同的密钥配置最小权限策略
   - 建议使用子账号密钥，而不是主账号密钥

## 完整 .env 配置示例

```bash
# 服务器配置
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=5242880

# JWT 配置
JWT_SECRET=banana_ai_super_secret_key_2024
JWT_EXPIRES_IN=7d

# 腾讯云 MySQL 配置
MYSQL_HOST=bj-cdb-xxxxx.sql.tencentcdb.com
MYSQL_PORT=3306
MYSQL_DATABASE=banana_ai
MYSQL_USERNAME=root
MYSQL_PASSWORD=YourStrongPassword123!

# 腾讯云 COS 配置
TENCENT_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COS_BUCKET=banana-ai-1234567890
COS_REGION=ap-guangzhou
COS_BASE_URL=https://banana-ai-1234567890.cos.ap-guangzhou.myqcloud.com
```

## 安全建议

1. **密钥安全**
   - 不要将 `.env` 文件提交到代码仓库
   - 使用 `.gitignore` 忽略 `.env` 文件
   - 生产环境使用子账号密钥，配置最小权限

2. **数据库安全**
   - 使用强密码
   - 限制访问 IP 白名单
   - 定期备份数据库

3. **存储安全**
   - COS 存储桶设置为"公有读私有写"
   - 敏感文件可使用签名 URL 访问
   - 定期检查存储桶访问日志

4. **环境隔离**
   - 开发环境和生产环境使用不同的配置
   - 不同环境使用不同的数据库和存储桶

## 启动应用

配置完成后，安装依赖并启动应用：

```bash
# 安装依赖
cd backend
npm install

# 开发模式启动
npm run dev

# 生产模式启动
npm start
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
- 确认安全组规则是否允许访问
- 验证用户名和密码是否正确
- 确认数据库是否已创建

### COS 上传失败

- 检查 `SecretId` 和 `SecretKey` 是否正确
- 确认存储桶名称和地域是否正确
- 检查存储桶权限配置
- 查看服务器是否有网络访问权限

### 图片无法访问

- 确认 COS 存储桶访问权限为"公有读"
- 检查 `COS_BASE_URL` 是否配置正确
- 确认文件已成功上传到 COS

## 更多帮助

- [腾讯云 MySQL 文档](https://cloud.tencent.com/document/product/236)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
- [Sequelize 文档](https://sequelize.org/)
- [COS Node.js SDK 文档](https://cloud.tencent.com/document/product/436/8629)


