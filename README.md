# Nano Banana AI - 全栈项目

一个使用 Koa 2.x + Vue 2.x + Tailwind CSS 构建的 AI 图像编辑工具，一比一还原 Banana AI 网站。

## 项目预览

![Nano Banana AI](https://banana.147ai.com/)

## 技术栈

### 后端
- **Koa 2.x** - Web 框架
- **MongoDB + Mongoose** - 数据库
- **JWT** - 用户认证
- **Multer** - 文件上传
- **bcryptjs** - 密码加密

### 前端
- **Vue 2.6.x** - 前端框架
- **Vue Router 3.x** - 路由管理
- **Vuex 3.x** - 状态管理
- **Tailwind CSS 3.x** - 样式框架
- **Axios** - HTTP 客户端

## 功能特性

### 核心功能
- ✅ 用户注册和登录（JWT 认证）
- ✅ AI 图片生成（Mock 模拟）
- ✅ 图片上传（最多3张，支持 JPG/PNG/WEBP）
- ✅ 多种 AI 模型选择
- ✅ 多种图片尺寸比例
- ✅ 积分系统（查询、消费、兑换）
- ✅ 套餐购买（Mock 支付）
- ✅ 订单管理
- ✅ 生成历史记录
- ✅ 个人中心
- ✅ API 文档页面
- ✅ 响应式设计（PC/移动端）

### 页面列表
- 首页 - AI 图片生成主界面
- 登录/注册页
- 套餐购买页
- 积分兑换页
- API 文档页
- 联系我们页
- 个人中心页

## 快速开始

### 环境要求
- Node.js >= 14.x
- MongoDB >= 4.x
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd banana-demo
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **配置后端环境变量**
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，配置数据库连接等
```

4. **启动 MongoDB**
```bash
# 确保 MongoDB 正在运行
mongod
```

5. **启动后端服务**
```bash
# 开发模式
npm run dev

# 或生产模式
npm start
```

后端服务将运行在 http://localhost:3000

6. **安装前端依赖**
```bash
cd ../frontend
npm install
```

7. **启动前端服务**
```bash
npm run serve
```

前端服务将运行在 http://localhost:8080

8. **访问应用**

打开浏览器访问 http://localhost:8080

## 项目结构

```
banana-demo/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # API 路由
│   │   ├── utils/          # 工具函数
│   │   └── app.js          # 应用入口
│   ├── uploads/            # 上传文件目录
│   ├── .env                # 环境变量
│   └── package.json
│
└── frontend/               # 前端应用
    ├── public/
    ├── src/
    │   ├── api/           # API 请求
    │   ├── assets/        # 静态资源
    │   ├── components/    # 公共组件
    │   ├── router/        # 路由配置
    │   ├── store/         # Vuex 状态
    │   ├── views/         # 页面组件
    │   ├── App.vue
    │   └── main.js
    ├── tailwind.config.js
    ├── vue.config.js
    └── package.json
```

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 文件上传
- `POST /api/upload` - 上传图片
- `DELETE /api/upload/:filename` - 删除图片

### 图片生成
- `POST /api/generate` - 生成图片
- `GET /api/generate/models` - 获取模型列表

### 积分系统
- `GET /api/credits` - 查询积分
- `POST /api/credits/redeem` - 兑换积分码

### 订单管理
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/packages/list` - 获取套餐列表

### 生成历史
- `GET /api/history` - 获取生成历史
- `GET /api/history/stats/summary` - 获取统计信息

## 开发说明

### 后端开发
- 端口：3000
- 数据库：mongodb://localhost:27017/banana-ai
- 新用户默认 100 积分
- 图片生成 Mock 延迟 2.5 秒

### 前端开发
- 端口：8080
- API 代理到 http://localhost:3000
- 使用 Tailwind CSS 实现响应式设计
- Vuex 管理全局状态

### 响应式断点
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 部署

### 后端部署
```bash
cd backend
npm run build  # 如果有构建步骤
npm start
```

### 前端部署
```bash
cd frontend
npm run build
# 将 dist/ 目录部署到静态服务器
```

## 测试账号

可以注册新账号进行测试，系统会自动分配 100 积分。

## 注意事项

- 本项目的 AI 图片生成功能使用 Mock 数据模拟，返回的是随机图片
- Mock 支付功能会立即完成订单并添加积分
- 图片上传限制：最大 5MB，最多 3 张
- 积分消耗：Banana(10)、Banana Pro(20)、Banana Pro Stable(25)

## 开发团队

本项目用于学习和演示目的。

## License

ISC

## 相关链接

- 原始网站：https://banana.147ai.com/
- Vue 2 文档：https://v2.vuejs.org/
- Koa 文档：https://koajs.com/
- Tailwind CSS：https://tailwindcss.com/

