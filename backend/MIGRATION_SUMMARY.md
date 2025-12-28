# 腾讯云 MySQL + COS 改造总结

## 改造完成情况

✅ 所有改造任务已完成，后端已成功从 MongoDB + 本地文件存储迁移到腾讯云 MySQL + 对象存储（COS）。

## 主要变更文件清单

### 1. 配置文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `package.json` | 修改 | 移除 mongoose 和 koa-static，添加 sequelize、mysql2、cos-nodejs-sdk-v5、axios |
| `src/config/database.js` | 重写 | 从 Mongoose 连接改为 Sequelize + MySQL 连接 |
| `src/config/cos.js` | 新增 | 腾讯云 COS 配置和工具函数（上传、删除、生成文件名） |

### 2. 模型文件（全部重写）

| 文件 | 变更说明 |
|------|---------|
| `src/models/User.js` | Mongoose Schema → Sequelize Model |
| `src/models/GenerationHistory.js` | Mongoose Schema → Sequelize Model |
| `src/models/Order.js` | Mongoose Schema → Sequelize Model |
| `src/models/RedeemCode.js` | Mongoose Schema → Sequelize Model |
| `src/models/index.js` | 新增：定义模型关联关系 |

**关键变更：**
- 主键从 `_id` (ObjectId) 改为 `id` (自增整数)
- 数组字段使用 `DataTypes.JSON` 存储
- 字段验证从 Mongoose 迁移到 Sequelize 验证器
- 钩子函数从 `pre('save')` 改为 `beforeSave`

### 3. 路由文件（全部适配 Sequelize）

| 文件 | 主要变更 |
|------|---------|
| `src/routes/auth.js` | 查询语法从 Mongoose 改为 Sequelize，使用 `Op` 操作符 |
| `src/routes/upload.js` | 集成 COS SDK，上传到 COS 而非本地文件系统 |
| `src/routes/generate.js` | 生成的图片上传到 COS，返回 COS URL |
| `src/routes/credits.js` | 查询和更新语法适配 Sequelize |
| `src/routes/order.js` | 查询和创建语法适配 Sequelize |
| `src/routes/history.js` | 使用 Sequelize 的 `findAndCountAll` 和聚合函数 |

**查询语法对比：**

```javascript
// Mongoose
const user = await User.findById(id);
const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(10);

// Sequelize
const user = await User.findByPk(id);
const users = await User.findAll({ 
  where: { role: 'user' }, 
  order: [['createdAt', 'DESC']], 
  limit: 10 
});
```

### 4. 中间件

| 文件 | 变更说明 |
|------|---------|
| `src/middleware/auth.js` | `User.findById()` → `User.findByPk()` |

### 5. 应用入口

| 文件 | 变更说明 |
|------|---------|
| `src/app.js` | 移除 MongoDB 连接和 koa-static 中间件 |

### 6. 文档

| 文件 | 类型 | 说明 |
|------|------|------|
| `README.md` | 更新 | 更新技术栈、架构说明、安装步骤 |
| `ENV_CONFIG.md` | 新增 | 详细的环境变量配置指南 |

## 技术栈对比

| 组件 | 改造前 | 改造后 |
|------|--------|--------|
| 数据库 | MongoDB | 腾讯云 MySQL |
| ORM | Mongoose | Sequelize |
| 文件存储 | 本地文件系统 (`uploads/`) | 腾讯云对象存储（COS） |
| 静态文件服务 | koa-static | 移除（使用 COS 公开访问） |
| 图片 URL | `/uploads/xxx.jpg` | `https://bucket.cos.region.myqcloud.com/xxx.jpg` |

## 数据模型变化

### 主键变化

```javascript
// MongoDB
{
  _id: ObjectId("507f1f77bcf86cd799439011")
}

// MySQL
{
  id: 1  // 自增整数
}
```

### 数组字段处理

```javascript
// MongoDB - 原生支持数组
inputImages: [String]

// MySQL - 使用 JSON 类型
inputImages: {
  type: DataTypes.JSON,
  defaultValue: []
}
```

### 时间戳字段

```javascript
// MongoDB (Mongoose)
{ timestamps: true }  // 自动生成 createdAt, updatedAt

// MySQL (Sequelize)
{ timestamps: true }  // 同样自动生成，但需要在模型中定义
```

## COS 存储架构

### 文件夹结构

```
存储桶名称-APPID/
├── uploads/              # 用户上传的图片
│   ├── 1234567890-123456789.jpg
│   ├── 1234567891-987654321.png
│   └── ...
└── generated/            # AI 生成的图片
    ├── 1234567892-111222333.jpg
    ├── 1234567893-444555666.png
    └── ...
```

### 文件命名规则

```javascript
const fileName = `${timestamp}-${random}${ext}`;
// 示例: 1703123456789-123456789.jpg
```

### 访问 URL 格式

```
https://{bucket}.cos.{region}.myqcloud.com/{folder}/{filename}
```

示例：
```
https://banana-ai-1234567890.cos.ap-guangzhou.myqcloud.com/uploads/1703123456789-123456789.jpg
```

## 依赖包变更

### 移除的依赖

- `mongoose` - MongoDB ORM
- `koa-static` - 本地静态文件服务

### 新增的依赖

- `sequelize` - MySQL ORM
- `mysql2` - MySQL 驱动
- `cos-nodejs-sdk-v5` - 腾讯云 COS SDK
- `axios` - HTTP 客户端（用于下载图片）

## 环境变量要求

### 新增的环境变量

```bash
# MySQL
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USERNAME
MYSQL_PASSWORD

# COS
TENCENT_SECRET_ID
TENCENT_SECRET_KEY
COS_BUCKET
COS_REGION
COS_BASE_URL
```

### 移除的环境变量

```bash
MONGODB_URI  # 不再需要
```

## API 响应变化

### 用户 ID 字段

```javascript
// 改造前
{
  "user": {
    "id": "507f1f77bcf86cd799439011",  // ObjectId 字符串
    ...
  }
}

// 改造后
{
  "user": {
    "id": 1,  // 整数
    ...
  }
}
```

### 图片 URL

```javascript
// 改造前
{
  "imageUrl": "/uploads/image-1703123456789.jpg"  // 本地路径
}

// 改造后
{
  "imageUrl": "https://banana-ai-1234567890.cos.ap-guangzhou.myqcloud.com/generated/1703123456789-123456789.jpg"  // COS URL
}
```

## 部署前准备清单

### 1. 腾讯云资源准备

- [ ] 创建 MySQL 实例
- [ ] 创建数据库 `banana_ai`
- [ ] 配置 MySQL 安全组规则
- [ ] 创建 COS 存储桶
- [ ] 配置存储桶访问权限为"公有读私有写"
- [ ] 配置 COS 跨域访问（CORS）
- [ ] 创建 API 密钥（SecretId 和 SecretKey）

### 2. 环境配置

- [ ] 创建 `.env` 文件
- [ ] 配置所有必需的环境变量
- [ ] 验证 MySQL 连接
- [ ] 验证 COS 上传功能

### 3. 应用部署

- [ ] 安装依赖：`npm install`
- [ ] 测试数据库连接
- [ ] 测试 COS 上传
- [ ] 启动应用：`npm run dev` 或 `npm start`

### 4. 验证测试

- [ ] 用户注册/登录
- [ ] 图片上传到 COS
- [ ] AI 生成图片
- [ ] 查看历史记录
- [ ] 积分兑换
- [ ] 订单创建

## 后续优化建议

### 1. 数据库优化

- 为高频查询字段添加索引
- 配置数据库连接池参数
- 定期备份数据库

### 2. COS 优化

- 配置 CDN 加速
- 使用生命周期管理清理过期文件
- 监控存储使用量和成本

### 3. 安全性增强

- 使用子账号密钥
- 配置最小权限策略
- 启用 COS 访问日志
- 定期轮换密钥

### 4. 性能优化

- 实现图片压缩和裁剪
- 添加缓存层（Redis）
- 使用队列处理异步任务
- 实现图片懒加载

### 5. 监控和日志

- 配置应用性能监控
- 设置 MySQL 慢查询监控
- 监控 COS 使用情况
- 配置告警规则

## 常见问题

### Q1: 如何从 MongoDB 迁移现有数据？

A: 需要编写数据迁移脚本：
1. 从 MongoDB 导出数据
2. 转换数据格式（ObjectId → Integer ID）
3. 将图片从本地上传到 COS
4. 更新数据库中的图片 URL
5. 导入数据到 MySQL

### Q2: 如何处理大文件上传？

A: 可以考虑：
1. 实现分片上传
2. 使用 COS 的分块上传接口
3. 增加文件大小限制配置

### Q3: COS 费用如何计算？

A: COS 按以下维度计费：
- 存储容量（GB/月）
- 请求次数
- 流量（下行流量）
建议查看腾讯云 COS 计费说明

### Q4: 如何回滚到 MongoDB 版本？

A: 使用 Git 回滚：
```bash
git checkout <commit-hash>  # 回滚到改造前的提交
npm install  # 重新安装依赖
```

## 技术支持

- 查看 [ENV_CONFIG.md](./ENV_CONFIG.md) 了解详细配置
- 查看 [README.md](./README.md) 了解项目架构
- 腾讯云技术支持：https://cloud.tencent.com/document

## 改造完成时间

改造完成日期：2024年12月

---

**注意**：首次运行前请确保已正确配置所有环境变量，并且腾讯云资源已创建完成。


