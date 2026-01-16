const Router = require('koa-router');
const { GenerationHistory } = require('../models');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

const router = new Router({ prefix: '/api/history' });

/**
 * 获取生成历史列表
 * GET /api/history
 */
router.get('/', auth, async (ctx) => {
  try {
    const user = ctx.state.user;
    const { page = 1, limit = 20, status } = ctx.query;
    
    const where = { userId: user.id };
    if (status) {
      where.status = status;
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await GenerationHistory.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    ctx.body = success({
      histories: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    }, '获取生成历史成功');
    
  } catch (err) {
    logger.error(`获取历史错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '获取生成历史失败');
  }
});

/**
 * 获取历史详情
 * GET /api/history/:id
 */
router.get('/:id', auth, async (ctx) => {
  try {
    const { id } = ctx.params;
    const user = ctx.state.user;
    
    const history = await GenerationHistory.findOne({
      where: {
        id,
        userId: user.id
      }
    });
    
    if (!history) {
      ctx.status = 404;
      ctx.body = error('历史记录不存在');
      return;
    }
    
    ctx.body = success(history, '获取历史详情成功');
    
  } catch (err) {
    logger.error(`获取历史详情错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '获取历史详情失败');
  }
});

/**
 * 删除历史记录
 * DELETE /api/history/:id
 */
router.delete('/:id', auth, async (ctx) => {
  try {
    const { id } = ctx.params;
    const user = ctx.state.user;
    
    const history = await GenerationHistory.findOne({
      where: {
        id,
        userId: user.id
      }
    });
    
    if (!history) {
      ctx.status = 404;
      ctx.body = error('历史记录不存在');
      return;
    }
    
    await history.destroy();
    
    ctx.body = success(null, '删除成功');
    
  } catch (err) {
    logger.error(`删除历史错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '删除历史记录失败');
  }
});

/**
 * 获取统计信息
 * GET /api/history/stats/summary
 */
router.get('/stats/summary', auth, async (ctx) => {
  try {
    const user = ctx.state.user;
    
    const [countResult, sumResult] = await Promise.all([
      GenerationHistory.count({ where: { userId: user.id } }),
      GenerationHistory.findOne({
        where: { userId: user.id },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('creditsUsed')), 'total']
        ],
        raw: true
      })
    ]);
    
    ctx.body = success({
      totalGenerations: countResult,
      totalCreditsUsed: parseInt(sumResult.total) || 0
    }, '获取统计信息成功');
    
  } catch (err) {
    logger.error(`获取统计错误: ${err.message}`);
    ctx.status = 500;
    ctx.body = error(err.message || '获取统计信息失败');
  }
});

module.exports = router;
