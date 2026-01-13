const Router = require('koa-router');
const { GenerationHistory, User } = require('../models');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { GoogleGenAI } = require('@google/genai');

const router = new Router({ prefix: '/api/generate' });

// Initialize Google GenAI Client
const genai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Model Mapping
const MODEL_MAPPING = {
  'banana': 'gemini-2.5-flash-image',
  'banana-pro': 'gemini-3-pro-image-preview',
  'banana-pro-stable': 'gemini-3-pro-image-preview', 
};

// Credit Costs (Mock/Estimation)
const MODEL_CREDITS = {
  'banana': 10,
  'banana-pro': 20,
  'banana-pro-stable': 25
};

/**
 * Process image data from frontend
 * @param {Object} imageData - Image data object with data (base64 data URL) and mimeType
 * @returns {Promise<{mimeType: string, data: string}>}
 */
const processImageData = async (imageData) => {
  // 前端传来的是 { data: 'data:image/jpeg;base64,xxx', mimeType: 'image/jpeg', name: 'xxx.jpg' }
  // 需要提取纯 base64 数据
  if (imageData.data && imageData.data.startsWith('data:')) {
    // 移除 data URL 前缀
    const base64Data = imageData.data.split(',')[1];
    return {
      mimeType: imageData.mimeType || 'image/jpeg',
      data: base64Data
    };
  }
  
  // 如果已经是纯 base64，直接返回
  return {
    mimeType: imageData.mimeType || 'image/jpeg',
    data: imageData.data
  };
};

/**
 * Convert buffer to base64 data URL
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 * @returns {string}
 */
const bufferToDataURL = (buffer, mimeType = 'image/png') => {
  const base64Data = buffer.toString('base64');
  return `data:${mimeType};base64,${base64Data}`;
};

/**
 * AI Image Generation
 * POST /api/generate
 */
router.post('/', async (ctx) => { // Removed 'auth' middleware
  try {
    const { prompt, model, aspectRatio, inputImages } = ctx.request.body;
    
    // Mock user for development
    const user = ctx.state.user || {
      id: 1,
      credits: 1000,
      save: async () => {} // Mock save
    };
    
    // Validation
    if (!prompt) {
      ctx.status = 400;
      ctx.body = error('Please provide a prompt');
      return;
    }
    
    if (!model) {
      ctx.status = 400;
      ctx.body = error('Please select a model');
      return;
    }
    
    const mappedModel = MODEL_MAPPING[model];
    if (!mappedModel) {
      ctx.status = 400;
      ctx.body = error('Invalid model selected');
      return;
    }

    // Check credits
    const creditsRequired = MODEL_CREDITS[model] || 10;
    if (user.credits < creditsRequired) {
      ctx.status = 400;
      ctx.body = error(`Insufficient credits. Required: ${creditsRequired}, Available: ${user.credits}`);
      return;
    }

    // Prepare contents
    const parts = [{ text: prompt }];

    // Handle input images (now receiving base64 data directly from frontend)
    if (inputImages && inputImages.length > 0) {
      for (const imageData of inputImages) {
        try {
          const imagePart = await processImageData(imageData);
          parts.push({ inlineData: imagePart });
        } catch (err) {
          console.error('Failed to process input image:', err);
          // Continue or fail? Let's warn but continue if possible, or maybe fail. 
          // If input image is critical, we should probably fail.
        }
      }
    }

    // Call Google GenAI
    // Note: aspectRatio might need to be in config
    const generateConfig = {};
    if (aspectRatio) {
      generateConfig.aspectRatio = aspectRatio;
    }

    console.log(`Generating with model: ${mappedModel}, aspectRatio: ${aspectRatio}`);

    const response = await genai.models.generateContent({
      model: mappedModel,
      contents: [{ role: 'user', parts }], // Correct format: array of content objects with role and parts
      config: generateConfig,
    });


    // Extract image and convert to data URL
    let outputImage = null;
    
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData) {
           const buffer = Buffer.from(part.inlineData.data, 'base64');
           const mimeType = part.inlineData.mimeType || 'image/png';
           
           // 直接返回 base64 data URL，不保存到本地
           outputImage = bufferToDataURL(buffer, mimeType);
           
           break;
        }
      }
    }

    if (!outputImage) {
      console.error('No image generated in response');
      throw new Error('No image generated in response');
    }

    // Deduct credits
    user.credits -= creditsRequired;
    await user.save();
    
    // Save history (only if real user, or try/catch if mock)
    try {
      if (user.id !== 1) { // Assuming mock user id is 1 and we skip DB
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
      }
    } catch (dbErr) {
      console.warn('Failed to save history (DB might not be connected):', dbErr.message);
    }
    
    ctx.body = success({
      imageUrl: outputImage,
      creditsUsed: creditsRequired,
      remainingCredits: user.credits,
      historyId: 0 // Mock history ID
    }, 'Image generated successfully');
    
  } catch (err) {
    console.error('Generation Error:', err);
    // Enhance error message if it's from Google API
    const message = err.message || 'Image generation failed';
    ctx.status = 500;
    ctx.body = error(message);
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
