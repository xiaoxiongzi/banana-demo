const Router = require('koa-router');
const { GenerationHistory, User } = require('../models');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { uploadFile, generateFileName } = require('../config/cos');
const axios = require('axios');

const router = new Router({ prefix: '/api/generate' });

// Mock 图片生成延迟（毫秒）
const GENERATION_DELAY = 2500;

// 不同模型的积分消耗
const MODEL_CREDITS = {
  'banana': 10,
  'banana-pro': 20,
  'banana-pro-stable': 25
};

// Mock 生成结果图片
const MOCK_RESULTS = [
  'https://picsum.photos/seed/result1/800/800',
  'https://picsum.photos/seed/result2/800/800',
  'https://picsum.photos/seed/result3/800/800',
  'https://picsum.photos/seed/result4/800/800',
  'https://picsum.photos/seed/result5/800/800'
];

/**
 * 下载图片并上传到 COS
 * @param {string} imageUrl - 图片 URL
 * @returns {Promise<string>} - COS 中的图片 URL
 */
const downloadAndUploadToCOS = async (imageUrl) => {
  try {
    // 下载图片
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    const buffer = Buffer.from(response.data, 'binary');
    const fileName = generateFileName('generated.jpg');
    
    // 上传到 COS
    const cosUrl = await uploadFile(buffer, fileName, 'generated');
    return cosUrl;
  } catch (err) {
    console.error('下载和上传图片失败:', err);
    // 如果上传失败，返回原始 URL
    return imageUrl;
  }
};

/**
 * AI 图片生成 (Mock)
 * POST /api/generate
 */
router.post('/', auth, async (ctx) => {
  try {
    const { prompt, model, aspectRatio, inputImages } = ctx.request.body;
    const user = ctx.state.user;
    
    // 验证必填字段
    if (!prompt) {
      ctx.status = 400;
      ctx.body = error('请提供图片描述');
      return;
    }
    
    if (!model) {
      ctx.status = 400;
      ctx.body = error('请选择 AI 模型');
      return;
    }
    
    if (!aspectRatio) {
      ctx.status = 400;
      ctx.body = error('请选择图片尺寸');
      return;
    }
    
    // 计算所需积分
    const creditsRequired = MODEL_CREDITS[model] || 10;
    
    // 检查积分是否足够
    if (user.credits < creditsRequired) {
      ctx.status = 400;
      ctx.body = error(`积分不足，需要 ${creditsRequired} 积分，当前只有 ${user.credits} 积分`);
      return;
    }
    
    // 模拟生成延迟
    await new Promise(resolve => setTimeout(resolve, GENERATION_DELAY));
    
    // 随机选择一个 Mock 结果
    const randomIndex = Math.floor(Math.random() * MOCK_RESULTS.length);
    const mockImageUrl = MOCK_RESULTS[randomIndex];
    
    // 下载并上传到 COS (在生产环境中，这一步会被实际的 AI 生成替代)
    const outputImage = await downloadAndUploadToCOS(mockImageUrl);
    
    // 扣除积分
    user.credits -= creditsRequired;
    await user.save();
    
    // 保存生成历史
    const history = await GenerationHistory.create({
      userId: user.id,
      prompt,
      model,
      aspectRatio,
      inputImages: inputImages || [],
      outputImage,
      creditsUsed: creditsRequired,
      status: 'completed'
    });
    
    ctx.body = success({
      imageUrl: outputImage,
      creditsUsed: creditsRequired,
      remainingCredits: user.credits,
      historyId: history.id
    }, '图片生成成功');
    
  } catch (err) {
    console.error('生成错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '图片生成失败');
  }
});

/**
 * 获取模型信息
 * GET /api/generate/models
 */
router.get('/models', async (ctx) => {
  try {
    const models = [
      {
        id: 'banana',
        name: 'Banana 推荐',
        icon: '⚡',
        credits: MODEL_CREDITS['banana'],
        description: '快速生成，效果优秀'
      },
      {
        id: 'banana-pro',
        name: 'Banana Pro 增强',
        icon: '🚀',
        credits: MODEL_CREDITS['banana-pro'],
        description: '增强版模型，细节更丰富'
      },
      {
        id: 'banana-pro-stable',
        name: 'Banana Pro 增强，稳定',
        icon: '⚓️',
        credits: MODEL_CREDITS['banana-pro-stable'],
        description: '稳定性更高，适合专业场景'
      }
    ];
    
    ctx.body = success(models, '获取模型列表成功');
    
  } catch (err) {
    console.error('获取模型错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '获取模型列表失败');
  }
});

module.exports = router;
