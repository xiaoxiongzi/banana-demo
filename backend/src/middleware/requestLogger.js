const morgan = require('koa-morgan');
const chalk = require('chalk');
const logger = require('../utils/logger');

/**
 * HTTP 状态码对应的颜色
 */
const getStatusColor = (status) => {
  if (status >= 500) return chalk.red;
  if (status >= 400) return chalk.yellow;
  if (status >= 300) return chalk.cyan;
  if (status >= 200) return chalk.green;
  return chalk.white;
};

/**
 * HTTP 方法对应的颜色
 */
const getMethodColor = (method) => {
  const colors = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
    OPTIONS: chalk.gray,
    HEAD: chalk.gray,
  };
  return colors[method] || chalk.white;
};

/**
 * 响应时间颜色
 */
const getTimeColor = (ms) => {
  if (ms > 1000) return chalk.red;
  if (ms > 500) return chalk.yellow;
  if (ms > 100) return chalk.cyan;
  return chalk.green;
};

/**
 * 自定义 Morgan Token
 */
// 带颜色的状态码
morgan.token('status-colored', (req, res) => {
  const status = res.statusCode;
  return getStatusColor(status)(status);
});

// 带颜色的 HTTP 方法（固定宽度）
morgan.token('method-colored', (req) => {
  const method = req.method;
  return getMethodColor(method)(method.padEnd(7));
});

// 响应时间（带单位和颜色）
morgan.token('response-time-colored', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return chalk.gray('-');
  }
  
  // 计算响应时间（毫秒）
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;
  
  const time = ms.toFixed(2);
  return getTimeColor(ms)(`${time}ms`);
});

// 客户端 IP
morgan.token('client-ip', (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         '-';
});

// 响应大小格式化
morgan.token('res-size', (req, res) => {
  const size = res.getHeader('content-length');
  if (!size) return '-';
  const bytes = parseInt(size, 10);
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
});

/**
 * 美观的日志格式
 * 格式: METHOD URL STATUS RESPONSE_TIME - SIZE
 */
const formatString = ':method-colored :url :status-colored :response-time-colored - :res-size';

/**
 * 创建请求日志中间件
 */
const requestLogger = morgan(formatString, {
  stream: logger.stream,
  // 跳过健康检查等频繁请求
  skip: (req) => {
    const skipPaths = ['/health', '/favicon.ico'];
    return skipPaths.some(path => req.url === path);
  },
});

module.exports = {
  requestLogger,
};
