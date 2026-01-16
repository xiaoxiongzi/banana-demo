const winston = require('winston');
const path = require('path');
const chalk = require('chalk');

/**
 * 自定义时间格式: [01-16 22:43:33:567]
 */
const customTimestamp = winston.format((info) => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  info.timestamp = `[${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}]`;
  return info;
});

/**
 * 日志级别配置
 */
const levelConfig = {
  error: { label: 'ERROR', colorFn: chalk.red },
  warn: { label: 'WARN ', colorFn: chalk.yellow },
  info: { label: 'INFO ', colorFn: chalk.green },
  http: { label: 'HTTP ', colorFn: chalk.cyan },
  debug: { label: 'DEBUG', colorFn: chalk.magenta },
};

/**
 * 移除 ANSI 颜色代码
 */
const stripAnsi = (str) => {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\u001b\[[0-9;]*m/g, '');
};

/**
 * 控制台输出格式（带颜色）
 */
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
  const config = levelConfig[level] || { label: level.toUpperCase().padEnd(5), colorFn: chalk.white };
  return `${config.colorFn(timestamp)} ${config.colorFn(config.label)} ${message}`;
});

/**
 * 文件输出格式（无颜色）
 */
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
  const config = levelConfig[level] || { label: level.toUpperCase().padEnd(5) };
  // 移除 message 中的 ANSI 颜色代码
  const cleanMessage = stripAnsi(message);
  return `${timestamp} ${config.label} ${cleanMessage}`;
});

/**
 * 创建 Winston Logger 实例
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'http',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  transports: [
    // 控制台输出（带颜色）
    new winston.transports.Console({
      format: winston.format.combine(
        customTimestamp(),
        consoleFormat
      ),
    }),
    // 文件输出 - 错误日志
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      format: winston.format.combine(
        customTimestamp(),
        fileFormat
      ),
    }),
    // 文件输出 - 所有日志
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      format: winston.format.combine(
        customTimestamp(),
        fileFormat
      ),
    }),
  ],
});

/**
 * Morgan 日志流适配器
 */
logger.stream = {
  write: (message) => {
    // 移除末尾换行符
    logger.http(message.trim());
  },
};

/**
 * 获取当前时间戳格式字符串
 */
logger.getTimestamp = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  return `[${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}]`;
};

module.exports = logger;
