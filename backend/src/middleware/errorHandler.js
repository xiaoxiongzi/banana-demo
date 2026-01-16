const logger = require('../utils/logger');

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(`错误: ${err.message}`, { stack: err.stack });
    
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || '服务器内部错误',
      code: ctx.status
    };
    
    // 触发 Koa 的错误事件
    ctx.app.emit('error', err, ctx);
  }
};

module.exports = errorHandler;

