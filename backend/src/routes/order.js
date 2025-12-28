const Router = require('koa-router');
const { Order, User } = require('../models');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');

const router = new Router({ prefix: '/api/orders' });

// 套餐配置
const PACKAGES = {
  basic: {
    name: '基础套餐',
    credits: 100,
    amount: 9.9,
    description: '适合新手尝试'
  },
  pro: {
    name: '专业套餐',
    credits: 500,
    amount: 39.9,
    description: '性价比之选',
    discount: 0.2
  },
  premium: {
    name: '高级套餐',
    credits: 1500,
    amount: 99.9,
    description: '重度用户首选',
    discount: 0.33
  },
  enterprise: {
    name: '企业套餐',
    credits: 5000,
    amount: 299.9,
    description: '企业级服务',
    discount: 0.4
  }
};

/**
 * 创建订单
 * POST /api/orders
 */
router.post('/', auth, async (ctx) => {
  try {
    const { packageType, paymentMethod = 'mock' } = ctx.request.body;
    const user = ctx.state.user;
    
    // 验证套餐类型
    if (!packageType || !PACKAGES[packageType]) {
      ctx.status = 400;
      ctx.body = error('无效的套餐类型');
      return;
    }
    
    const pkg = PACKAGES[packageType];
    
    // 创建订单
    const order = await Order.create({
      userId: user.id,
      packageType,
      amount: pkg.amount,
      credits: pkg.credits,
      paymentMethod,
      status: 'pending',
      transactionId: `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    
    // Mock 支付：直接完成订单
    if (paymentMethod === 'mock') {
      order.status = 'completed';
      order.completedAt = new Date();
      await order.save();
      
      // 添加积分
      user.credits += pkg.credits;
      await user.save();
      
      ctx.body = success({
        order: {
          id: order.id,
          packageType: order.packageType,
          amount: order.amount,
          credits: order.credits,
          status: order.status,
          createdAt: order.createdAt
        },
        creditsAdded: pkg.credits,
        totalCredits: user.credits
      }, '购买成功');
    } else {
      ctx.body = success({
        order: {
          id: order.id,
          packageType: order.packageType,
          amount: order.amount,
          credits: order.credits,
          status: order.status,
          createdAt: order.createdAt
        }
      }, '订单创建成功，请完成支付');
    }
    
  } catch (err) {
    console.error('创建订单错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '创建订单失败');
  }
});

/**
 * 获取订单列表
 * GET /api/orders
 */
router.get('/', auth, async (ctx) => {
  try {
    const user = ctx.state.user;
    const { page = 1, limit = 10, status } = ctx.query;
    
    const where = { userId: user.id };
    if (status) {
      where.status = status;
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });
    
    ctx.body = success({
      orders: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    }, '获取订单列表成功');
    
  } catch (err) {
    console.error('获取订单错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '获取订单列表失败');
  }
});

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
router.get('/:id', auth, async (ctx) => {
  try {
    const { id } = ctx.params;
    const user = ctx.state.user;
    
    const order = await Order.findOne({
      where: {
        id,
        userId: user.id
      }
    });
    
    if (!order) {
      ctx.status = 404;
      ctx.body = error('订单不存在');
      return;
    }
    
    ctx.body = success(order, '获取订单详情成功');
    
  } catch (err) {
    console.error('获取订单详情错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '获取订单详情失败');
  }
});

/**
 * 获取套餐列表
 * GET /api/orders/packages/list
 */
router.get('/packages/list', async (ctx) => {
  try {
    const packages = Object.keys(PACKAGES).map(key => ({
      id: key,
      ...PACKAGES[key]
    }));
    
    ctx.body = success(packages, '获取套餐列表成功');
    
  } catch (err) {
    console.error('获取套餐列表错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '获取套餐列表失败');
  }
});

module.exports = router;
