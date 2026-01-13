# MySQL 数据库改造总结

## 改造完成情况

✅ 所有改造任务已完成，后端已成功从 MongoDB 迁移到 MySQL。图片处理采用内存方式，不再保存到本地或云存储。

## 主要变更文件清单

### 1. 配置文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `package.json` | 修改 | 移除 mongoose，添加 sequelize、mysql2 |
| `src/config/database.js` | 重写 | 从 Mongoose 连接改为 Sequelize + MySQL 连接 |

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
| `src/routes/generate.js` | 图片处理改为内存方式，接收和返回 base64 数据 |
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
| 数据库 | MongoDB | MySQL |
| ORM | Mongoose | Sequelize |
| 文件存储 | 本地文件系统 (`uploads/`) | 内存处理（base64） |
| 静态文件服务 | koa-static | 移除 |
| 图片数据 | 文件路径 `/uploads/xxx.jpg` | base64 data URL |

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

## 图片处理架构

### 内存处理方式

所有图片均在内存中处理，不保存到本地或云存储：

1. **前端上传**：使用 FileReader 读取图片为 base64 格式
2. **后端接收**：接收 base64 数据并直接透传给 AI 服务
3. **AI 生成**：AI 返回的图片 buffer 转换为 base64 data URL
4. **前端显示**：直接显示 base64 图片

### 数据格式

```javascript
// 前端上传的图片格式
{
  data: 'data:image/jpeg;base64,...',
  mimeType: 'image/jpeg',
  name: 'example.jpg'
}

// 后端返回的图片格式
{
  imageUrl: 'data:image/png;base64,...'
}
```

## 依赖包变更

### 移除的依赖

- `mongoose` - MongoDB ORM
- `koa-static` - 本地静态文件服务
- `cos-nodejs-sdk-v5` - 腾讯云 COS SDK（不再需要）
- `axios` - HTTP 客户端（不再需要）

### 新增的依赖

- `sequelize` - MySQL ORM
- `mysql2` - MySQL 驱动
- `@google/genai` - Google GenAI SDK

## 环境变量要求

### 新增的环境变量

```bash
# MySQL
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USERNAME
MYSQL_PASSWORD

# Google GenAI
GOOGLE_GENAI_API_KEY
```

### 移除的环境变量

```bash
MONGODB_URI           # 不再需要
TENCENT_SECRET_ID     # 不再需要
TENCENT_SECRET_KEY    # 不再需要
COS_BUCKET           # 不再需要
COS_REGION           # 不再需要
COS_BASE_URL         # 不再需要
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

### 图片数据

```javascript
// 改造前
{
  "imageUrl": "/uploads/image-1703123456789.jpg"  // 本地路径
}

// 改造后
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."  // base64 data URL
}
```

## 部署前准备清单

### 1. 数据库准备

- [ ] 安装 MySQL 服务
- [ ] 创建数据库 `banana_ai`
- [ ] 配置数据库用户权限

### 2. API 密钥准备

- [ ] 获取 Google GenAI API Key

### 3. 环境配置

- [ ] 创建 `.env` 文件
- [ ] 配置所有必需的环境变量
- [ ] 验证 MySQL 连接
- [ ] 验证 Google GenAI API

### 4. 应用部署

- [ ] 安装依赖：`yarn install`
- [ ] 测试数据库连接
- [ ] 测试 AI 图片生成
- [ ] 启动应用：`yarn dev` 或 `yarn start`

### 5. 验证测试

- [ ] 用户注册/登录
- [ ] 图片上传（内存处理）
- [ ] AI 生成图片
- [ ] 查看历史记录
- [ ] 积分兑换
- [ ] 订单创建

## 后续优化建议

### 1. 数据库优化

- 为高频查询字段添加索引
- 配置数据库连接池参数
- 定期备份数据库

### 2. 图片处理优化

- 实现前端图片压缩
- 限制图片大小和分辨率
- 优化 base64 数据传输

### 3. 安全性增强

- 保护 API 密钥安全
- 实现请求频率限制
- 添加图片内容检测

### 4. 性能优化

- 添加缓存层（Redis）
- 使用队列处理异步任务
- 优化数据库查询

### 5. 监控和日志

- 配置应用性能监控
- 设置 MySQL 慢查询监控
- 监控 AI API 调用情况
- 配置告警规则

## 常见问题

### Q1: 如何从 MongoDB 迁移现有数据？

A: 需要编写数据迁移脚本：
1. 从 MongoDB 导出数据
2. 转换数据格式（ObjectId → Integer ID）
3. 导入数据到 MySQL
4. 注意：历史图片 URL 需要特殊处理

### Q2: 为什么不保存图片到服务器？

A: 采用内存处理方式的优势：
1. 节省服务器存储空间
2. 不需要云存储服务，降低成本
3. 更快的响应速度
4. 更好的隐私保护

### Q3: base64 图片数据会不会太大？

A: 注意事项：
1. base64 会比原始图片大约 33%
2. 建议限制图片大小（如 5MB）
3. 可以在前端进行图片压缩
4. 适合中小型图片处理

### Q4: 如何回滚到 MongoDB 版本？

A: 使用 Git 回滚：
```bash
git checkout <commit-hash>  # 回滚到改造前的提交
yarn install  # 重新安装依赖
```

## 技术支持

- 查看 [ENV_CONFIG.md](./ENV_CONFIG.md) 了解详细配置
- 查看 [README.md](./README.md) 了解项目架构
- MySQL 文档：https://dev.mysql.com/doc/
- Google GenAI 文档：https://ai.google.dev/

## 改造完成时间

改造完成日期：2024年12月

---

**注意**：首次运行前请确保已正确配置所有环境变量，并且腾讯云资源已创建完成。


