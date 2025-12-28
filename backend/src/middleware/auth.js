const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * JWT 认证中间件
 */
const auth = async (ctx, next) => {
  try {
    // 从请求头获取 token
    const authHeader = ctx.request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '未提供认证令牌'
      };
      return;
    }
    
    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    // 验证 token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '认证令牌无效或已过期'
      };
      return;
    }
    
    // 查找用户
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '用户不存在'
      };
      return;
    }
    
    // 将用户信息附加到上下文
    ctx.state.user = user;
    
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: '认证失败'
    };
  }
};

/**
 * 可选认证中间件（用户可能登录也可能未登录）
 */
const optionalAuth = async (ctx, next) => {
  try {
    const authHeader = ctx.request.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await User.findByPk(decoded.id);
        if (user) {
          ctx.state.user = user;
        }
      }
    }
    
    await next();
  } catch (error) {
    // 可选认证失败不阻止请求
    await next();
  }
};

module.exports = {
  auth,
  optionalAuth
};
