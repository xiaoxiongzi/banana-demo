const Router = require('koa-router');
// const multer = require('@koa/multer'); // 不需要 multer 了，koa-body 处理了
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { generateFileName } = require('../config/cos');

const router = new Router({ prefix: '/api/upload' });

// 配置 multer - 使用内存存储 (移除，因为 koa-body 已经全局配置了 multipart)
// const storage = multer.memoryStorage();
// ...
// const upload = multer({...});

/**
 * 上传图片到腾讯云 COS
 * POST /api/upload
 */
router.post('/', async (ctx) => { // 移除了 upload.array 中间件
  // 如果 koa-body 解析失败，multer 会尝试重新解析，或者这里可能需要直接处理 ctx.req
  try {
    // 检查 ctx.files 或 ctx.request.files
    const files = ctx.files || ctx.request.files;
    
    // 兼容处理：如果是 koa-body 处理后的文件，结构可能不同
    let filesToUpload = [];
    
    if (files) {
      if (Array.isArray(files)) {
        filesToUpload = files;
      } else if (files.images) {
         // koa-body 可能会把文件放在 files.images 中
         filesToUpload = Array.isArray(files.images) ? files.images : [files.images];
      }
    }

    if (!filesToUpload || filesToUpload.length === 0) {
      ctx.status = 400;
      ctx.body = error('请选择要上传的图片');
      return;
    }
    
    // 上传所有文件到 COS (或本地)
    const uploadPromises = filesToUpload.map(async (file) => {
       // 注意：如果是 koa-body，file.buffer 可能不存在，而是 file.filepath
       // 如果是 multer memoryStorage，则有 file.buffer
       
       const originalName = file.originalFilename || file.newFilename || file.name || 'unknown.jpg';
       const fileName = generateFileName(originalName);
       let buffer;
       
       if (file.buffer) {
         buffer = file.buffer;
       } else if (file.filepath || file.path) {
         const fs = require('fs');
         buffer = fs.readFileSync(file.filepath || file.path);
       }
       
       if (!buffer) {
         throw new Error('无法读取文件内容');
       }

       // 既然前面 generate.js 改成了存本地，这里保持一致，或者复用 COS 上传(如果 COS 配置了的话)
       // 为了简化，这里也先存本地，复用 generate.js 里的 saveToLocal 逻辑的变体
       
       const fs = require('fs');
       const path = require('path');
       const uploadDir = path.join(__dirname, '../../uploads'); // 存放在 uploads 根目录或子目录
       if (!fs.existsSync(uploadDir)) {
         fs.mkdirSync(uploadDir, { recursive: true });
       }
       const filePath = path.join(uploadDir, fileName);
       fs.writeFileSync(filePath, buffer);
       
       return `/uploads/${fileName}`;
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
