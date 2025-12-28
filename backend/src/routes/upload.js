const Router = require('koa-router');
const multer = require('@koa/multer');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { uploadFile, deleteFile, generateFileName } = require('../config/cos');

const router = new Router({ prefix: '/api/upload' });

// 配置 multer - 使用内存存储
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持 JPG、PNG、WEBP 格式的图片'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  }
});

/**
 * 上传图片到腾讯云 COS
 * POST /api/upload
 */
router.post('/', auth, upload.array('images', 3), async (ctx) => {
  try {
    if (!ctx.files || ctx.files.length === 0) {
      ctx.status = 400;
      ctx.body = error('请选择要上传的图片');
      return;
    }
    
    // 上传所有文件到 COS
    const uploadPromises = ctx.files.map(async (file) => {
      const fileName = generateFileName(file.originalname);
      const fileUrl = await uploadFile(file.buffer, fileName, 'uploads');
      return fileUrl;
    });
    
    const fileUrls = await Promise.all(uploadPromises);
    
    ctx.body = success({
      files: fileUrls,
      count: fileUrls.length
    }, '图片上传成功');
    
  } catch (err) {
    console.error('上传错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '图片上传失败');
  }
});

/**
 * 删除 COS 中的图片
 * DELETE /api/upload
 * Body: { url: 'https://...' }
 */
router.delete('/', auth, async (ctx) => {
  try {
    const { url } = ctx.request.body;
    
    if (!url) {
      ctx.status = 400;
      ctx.body = error('请提供要删除的图片 URL');
      return;
    }
    
    await deleteFile(url);
    ctx.body = success(null, '图片删除成功');
    
  } catch (err) {
    console.error('删除错误:', err);
    ctx.status = 500;
    ctx.body = error(err.message || '图片删除失败');
  }
});

module.exports = router;
