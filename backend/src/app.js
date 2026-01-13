require('dotenv').config();
const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// 创建 Koa 应用
const app = new Koa();

// 连接数据库
connectDB();

// 中间件
app.use(errorHandler);
app.use(cors());
app.use(koaBody());

// 路由
const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const creditsRoutes = require('./routes/credits');
const orderRoutes = require('./routes/order');
const historyRoutes = require('./routes/history');

app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(generateRoutes.routes()).use(generateRoutes.allowedMethods());
app.use(creditsRoutes.routes()).use(creditsRoutes.allowedMethods());
app.use(orderRoutes.routes()).use(orderRoutes.allowedMethods());
app.use(historyRoutes.routes()).use(historyRoutes.allowedMethods());

// 健康检查
const Router = require('koa-router');
const router = new Router();
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', message: 'Banana AI API is running' };
});
app.use(router.routes()).use(router.allowedMethods());

// 错误监听
app.on('error', (err, ctx) => {
  console.error('服务器错误:', err);
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
