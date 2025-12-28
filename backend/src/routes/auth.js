const Router = require('koa-router');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = new Router({ prefix: '/api/auth' });

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (ctx) => {
  try {
    const { username, email, password } = ctx.request.body;
    
    // 验证必填字段
    if (!username || !email || !password) {
      ctx.status = 400;
      ctx.body = error('用户名、邮箱和密码都是必填项');
      return;
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase() },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      ctx.status = 400;
      ctx.body = error(
        existingUser.email === email.toLowerCase() ? '该邮箱已被注册' : '该用户名已被使用'
      );
      return;
    }
    
    // 创建新用户
    const user = await User.create({
      username,
      email,
      password
    });
    
    // 生成 token
    const token = generateToken(user.id);
    
    ctx.status = 201;
    ctx.body = success({
      user: user.toPublicJSON(),
      token
    }, '注册成功');
    
  } catch (err) {
    console.error('注册错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '注册失败');
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    
    // 验证必填字段
    if (!email || !password) {
      ctx.status = 400;
      ctx.body = error('邮箱和密码都是必填项');
      return;
    }
    
    // 查找用户（包含密码字段）
    const user = await User.findOne({ 
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      ctx.status = 401;
      ctx.body = error('邮箱或密码错误');
      return;
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      ctx.status = 401;
      ctx.body = error('邮箱或密码错误');
      return;
    }
    
    // 生成 token
    const token = generateToken(user.id);
    
    ctx.body = success({
      user: user.toPublicJSON(),
      token
    }, '登录成功');
    
  } catch (err) {
    console.error('登录错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '登录失败');
  }
});

/**
 * 获取当前用户信息
 * GET /api/auth/profile
 */
router.get('/profile', auth, async (ctx) => {
  try {
    const user = ctx.state.user;
    
    ctx.body = success(user.toPublicJSON(), '获取用户信息成功');
    
  } catch (err) {
    console.error('获取用户信息错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '获取用户信息失败');
  }
});

/**
 * 更新用户信息
 * PUT /api/auth/profile
 */
router.put('/profile', auth, async (ctx) => {
  try {
    const { username, avatar } = ctx.request.body;
    const user = ctx.state.user;
    
    // 更新允许修改的字段
    if (username) {
      // 检查用户名是否已被使用
      const existingUser = await User.findOne({ 
        where: {
          username,
          id: { [Op.ne]: user.id }
        }
      });
      
      if (existingUser) {
        ctx.status = 400;
        ctx.body = error('该用户名已被使用');
        return;
      }
      
      user.username = username;
    }
    
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    
    await user.save();
    
    ctx.body = success(user.toPublicJSON(), '更新用户信息成功');
    
  } catch (err) {
    console.error('更新用户信息错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '更新用户信息失败');
  }
});

module.exports = router;
