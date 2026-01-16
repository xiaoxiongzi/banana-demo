const Router = require('koa-router');
const { RedeemCode, User } = require('../models');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

const router = new Router({ prefix: '/api/credits' });

/**
 * 获取当前积分
 * GET /api/credits
 */
router.get('/', auth, async (ctx) => {
  try {
    const user = ctx.state.user;
    
    ctx.body = success({
      credits: user.credits,
      userId: user.id
    }, '获取积分成功');
    
  } catch (err) {
    logger.error(`获取积分错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '获取积分失败');
  }
});

/**
 * 兑换积分码
 * POST /api/credits/redeem
 */
router.post('/redeem', auth, async (ctx) => {
  try {
    const { code } = ctx.request.body;
    const user = ctx.state.user;
    
    // 验证必填字段
    if (!code) {
      ctx.status = 400;
      ctx.body = error('请提供兑换码');
      return;
    }
    
    // 查找兑换码
    const redeemCode = await RedeemCode.findOne({ 
      where: { code: code.toUpperCase().trim() }
    });
    
    if (!redeemCode) {
      ctx.status = 404;
      ctx.body = error('兑换码不存在');
      return;
    }
    
    // 检查是否已使用
    if (redeemCode.isUsed) {
      ctx.status = 400;
      ctx.body = error('兑换码已被使用');
      return;
    }
    
    // 检查是否过期
    if (new Date() > redeemCode.expiresAt) {
      ctx.status = 400;
      ctx.body = error('兑换码已过期');
      return;
    }
    
    // 添加积分
    user.credits += redeemCode.credits;
    await user.save();
    
    // 标记兑换码为已使用
    redeemCode.isUsed = true;
    redeemCode.usedBy = user.id;
    redeemCode.usedAt = new Date();
    await redeemCode.save();
    
    ctx.body = success({
      creditsAdded: redeemCode.credits,
      totalCredits: user.credits
    }, `成功兑换 ${redeemCode.credits} 积分`);
    
  } catch (err) {
    logger.error(`兑换积分错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '兑换积分失败');
  }
});

/**
 * 生成兑换码（管理员功能）
 * POST /api/credits/generate-code
 */
router.post('/generate-code', auth, async (ctx) => {
  try {
    const user = ctx.state.user;
    
    // 检查是否为管理员
    if (user.role !== 'admin') {
      ctx.status = 403;
      ctx.body = error('权限不足');
      return;
    }
    
    const { credits, count = 1, validDays = 30 } = ctx.request.body;
    
    if (!credits || credits <= 0) {
      ctx.status = 400;
      ctx.body = error('请提供有效的积分数量');
      return;
    }
    
    const codes = [];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validDays);
    
    for (let i = 0; i < count; i++) {
      const code = generateRandomCode();
      const redeemCode = await RedeemCode.create({
        code,
        credits,
        expiresAt
      });
      codes.push({
        code: redeemCode.code,
        credits: redeemCode.credits,
        expiresAt: redeemCode.expiresAt
      });
    }
    
    ctx.body = success({
      codes,
      count: codes.length
    }, '兑换码生成成功');
    
  } catch (err) {
    logger.error(`生成兑换码错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '生成兑换码失败');
  }
});

/**
 * 生成随机兑换码
 */
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-';
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;
