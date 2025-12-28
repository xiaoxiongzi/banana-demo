/**
 * 成功响应
 */
const success = (data = null, message = '操作成功') => {
  return {
    success: true,
    message,
    data
  };
};

/**
 * 错误响应
 */
const error = (message = '操作失败', code = 400) => {
  return {
    success: false,
    message,
    code
  };
};

module.exports = {
  success,
  error
};

