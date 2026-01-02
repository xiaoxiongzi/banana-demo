const Router = require('koa-router');
const { GenerationHistory, User } = require('../models');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
// const { uploadFile, generateFileName } = require('../config/cos');
const { generateFileName } = require('../config/cos'); // Only import utility
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

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
 * Fetch image from URL and convert to base64
 * @param {string} url 
 * @returns {Promise<{mimeType: string, data: string}>}
 */
const fetchImageAsBase64 = async (url) => {
  // 处理本地图片路径 (e.g. /uploads/xxx.jpg)
  if (url.startsWith('/')) {
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(__dirname, '../../', url);
    const data = fs.readFileSync(localPath).toString('base64');
    // 简单的 MIME 类型推断
    let mimeType = 'image/jpeg';
    if (url.endsWith('.png')) mimeType = 'image/png';
    else if (url.endsWith('.webp')) mimeType = 'image/webp';
    return { mimeType, data };
  }

  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const mimeType = response.headers['content-type'] || 'image/jpeg';
  const data = Buffer.from(response.data).toString('base64');
  return { mimeType, data };
};

/**
 * Save buffer to local file
 * @param {Buffer} buffer 
 * @param {string} fileName 
 * @returns {Promise<string>}
 */
const saveToLocal = async (buffer, fileName) => {
  const uploadDir = path.join(__dirname, '../../uploads/generated');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  
  // Return relative path or full URL depending on how you serve static files
  return `/uploads/generated/${fileName}`;
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

    // Handle input images
    if (inputImages && inputImages.length > 0) {
      for (const imgUrl of inputImages) {
        try {
          const imagePart = await fetchImageAsBase64(imgUrl);
          parts.push({ inlineData: imagePart });
        } catch (err) {
          console.error('Failed to fetch input image:', imgUrl, err);
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

    console.log(`Generating with model: ${mappedModel}, config:`, generateConfig);

    const response = await genai.models.generateContent({
      model: mappedModel,
      contents: parts, // New SDK expects 'contents' which can be array of parts or just text
      config: generateConfig,
    });


    // Extract image
    let outputImage = null;
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
           const buffer = Buffer.from(part.inlineData.data, 'base64');
           const fileName = generateFileName('generated.png'); // Usually PNG
           
           // CHANGE: Save to local instead of COS
           outputImage = await saveToLocal(buffer, fileName);
           
           break;
        }
      }
    }

    if (!outputImage) {
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
