# Banana AI Frontend

基于 Vue 2.x + Tailwind CSS 的 AI 图像编辑工具前端应用

## 功能特性

- 用户认证（登录、注册）
- AI 图片生成
- 图片上传
- 积分管理和兑换
- 订单管理
- 生成历史记录
- 响应式设计（PC/移动端）

## 技术栈

- Vue 2.6.x
- Vue Router 3.x
- Vuex 3.x
- Tailwind CSS 3.x
- Axios

## 安装步骤

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run serve
```

3. 构建生产版本：
```bash
npm run build
```

## 项目结构

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/                  # API 请求
│   │   ├── request.js       # Axios 配置
│   │   ├── auth.js          # 认证 API
│   │   ├── upload.js        # 上传 API
│   │   ├── generate.js      # 生成 API
│   │   ├── credits.js       # 积分 API
│   │   ├── order.js         # 订单 API
│   │   └── history.js       # 历史 API
│   ├── assets/
│   │   └── styles/
│   │       └── main.css     # 全局样式
│   ├── components/          # 公共组件
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Toast.vue
│   │   ├── ModelSelector.vue
│   │   ├── AspectRatioSelector.vue
│   │   ├── ImageUploader.vue
│   │   ├── GenerateButton.vue
│   │   └── ResultDisplay.vue
│   ├── views/               # 页面组件
│   │   ├── Home.vue
│   │   ├── Auth.vue
│   │   ├── Pricing.vue
│   │   ├── Credits.vue
│   │   ├── ApiDoc.vue
│   │   ├── Contact.vue
│   │   └── Profile.vue
│   ├── router/
│   │   └── index.js         # 路由配置
│   ├── store/               # Vuex 状态管理
│   │   ├── index.js
│   │   └── modules/
│   ��       ├── auth.js
│   │       ├── user.js
│   │       ├── generation.js
│   │       └── ui.js
│   ├── App.vue
│   └── main.js
├── tailwind.config.js
├── vue.config.js
└── package.json
```

## 开发说明

- 默认端口：8080
- API 代理：http://localhost:3000
- 需要后端服务运行在 3000 端口

## License

ISC

