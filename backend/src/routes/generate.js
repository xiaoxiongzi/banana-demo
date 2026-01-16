const Router = require('koa-router');
const { GenerationHistory } = require('../models');
const { success, error } = require('../utils/response');
const { GoogleGenAI } = require('@google/genai');
const router = new Router({ prefix: '/api/generate' });

// Initialize Google GenAI Client
const googleGenAIBaseUrl = process.env.GOOGLE_GENAI_BASE_URL;
const genai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  ...(googleGenAIBaseUrl ? { httpOptions: { baseUrl: googleGenAIBaseUrl } } : {}),
});

// Model Mapping
const MODEL_MAPPING = {
  'banana': 'gemini-2.5-flash-image',
  'banana-pro': 'gemini-3-pro-image-preview',
  'banana-pro-stable': 'gemini-3-pro-image-preview', 
};

// Credit Costs
const MODEL_CREDITS = {
  'banana': 10,
  'banana-pro': 20,
  'banana-pro-stable': 25
};

/**
 * 处理前端传来的图片数据，提取纯 base64
 */
const processImageData = (imageData) => {
  const mimeType = imageData.mimeType || 'image/jpeg';
  // 如果是 data URL 格式，提取纯 base64
  if (imageData.data?.startsWith('data:')) {
    return { mimeType, data: imageData.data.split(',')[1] };
  }
  return { mimeType, data: imageData.data };
};

/**
 * 将 base64 数据转换为 data URL
 */
const toDataURL = (base64Data, mimeType = 'image/png') => {
  return `data:${mimeType};base64,${base64Data}`;
};

/**
 * 验证生成请求参数
 */
const validateGenerateRequest = (body) => {
  const { prompt, model } = body;
  if (!prompt) return 'Please provide a prompt';
  if (!model) return 'Please select a model';
  if (!MODEL_MAPPING[model]) return 'Invalid model selected';
  return null;
};

/**
 * 构建请求内容 parts
 */
const buildRequestParts = (prompt, inputImages = []) => {
  const parts = [{ text: prompt }];
  
  for (const imageData of inputImages) {
    const processed = processImageData(imageData);
    parts.push({
      inlineData: {
        mimeType: processed.mimeType,
        data: processed.data
      }
    });
  }
  
  return parts;
};

/**
 * 从 API 响应中提取生成的图片
 */
const extractImageFromResponse = (response) => {
  // 尝试从 candidates 获取
  const parts = response.candidates?.[0]?.content?.parts || response.parts || [];
  
  for (const part of parts) {
    if (part.inlineData?.data) {
      const { data, mimeType = 'image/png' } = part.inlineData;
      return toDataURL(data, mimeType);
    }
  }
  
  return null;
};

/**
 * AI Image Generation
 * POST /api/generate
 */
router.post('/', async (ctx) => {
  try {
    const { prompt, model, aspectRatio, inputImages } = ctx.request.body;
    
    // 参数验证
    const validationError = validateGenerateRequest(ctx.request.body);
    if (validationError) {
      ctx.status = 400;
      ctx.body = error(validationError);
      return;
    }

    // Mock user for development
    const user = ctx.state.user || { id: 1, credits: 1000, save: async () => {} };
    
    // 检查积分
    const creditsRequired = MODEL_CREDITS[model] || 10;
    if (user.credits < creditsRequired) {
      ctx.status = 400;
      ctx.body = error(`Insufficient credits. Required: ${creditsRequired}, Available: ${user.credits}`);
      return;
    }

    // 调用 Google GenAI
    const response = await genai.models.generateContent({
      model: MODEL_MAPPING[model],
      contents: buildRequestParts(prompt, inputImages),
      config: { imageConfig: { aspectRatio: aspectRatio || '1:1' } },
    });

    // 提取生成的图片
    const outputImage = extractImageFromResponse(response);
    if (!outputImage) {
      throw new Error('No image generated in response');
    }

    // 扣除积分
    user.credits -= creditsRequired;
    await user.save();
    
    // 保存历史记录（非 mock 用户）
    if (user.id !== 1) {
      try {
        await GenerationHistory.create({
          userId: user.id,
          prompt,
          model,
          aspectRatio,
          inputImages: inputImages || [],
          outputImage,
          creditsUsed: creditsRequired,
          status: 'completed'
        });
      } catch (dbErr) {
        console.warn('Failed to save history:', dbErr.message);
      }
    }
    
    ctx.body = success({
      imageUrl: outputImage,
      creditsUsed: creditsRequired,
      remainingCredits: user.credits,
      historyId: 0
    }, 'Image generated successfully');
    
  } catch (err) {
    console.error('Generation Error:', err);
    ctx.status = 500;
    ctx.body = error(err.message || 'Image generation failed');
  }
});

/**
 * Get Models
 * GET /api/generate/models
 */
router.get('/models', async (ctx) => {
  try {
    const models = [
      {
        id: 'banana',
        name: 'Nano Banana (Flash)',
        icon: '⚡',
        credits: MODEL_CREDITS['banana'],
        description: 'Fast, efficient generation (Gemini 2.5 Flash)'
      },
      {
        id: 'banana-pro',
        name: 'Nano Banana Pro',
        icon: '🚀',
        credits: MODEL_CREDITS['banana-pro'],
        description: 'High quality, professional generation (Gemini 3 Pro)'
      },
      {
        id: 'banana-pro-stable',
        name: 'Nano Banana Pro (Stable)',
        icon: '⚓️',
        credits: MODEL_CREDITS['banana-pro-stable'],
        description: 'Stable version for professional use'
      }
    ];
    
    ctx.body = success(models, 'Models retrieved successfully');
    
  } catch (err) {
    console.error('Get models error:', err);
    ctx.status = 500;
    ctx.body = error(err.message || 'Failed to retrieve models');
  }
});

module.exports = router;
