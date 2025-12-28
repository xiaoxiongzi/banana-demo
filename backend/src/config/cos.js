const COS = require('cos-nodejs-sdk-v5');
const path = require('path');

// 初始化 COS 客户端
const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID,
  SecretKey: process.env.TENCENT_SECRET_KEY,
});

// COS 配置
const cosConfig = {
  Bucket: process.env.COS_BUCKET,
  Region: process.env.COS_REGION,
  BaseUrl: process.env.COS_BASE_URL || `https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com`,
};

/**
 * 上传文件到 COS
 * @param {Buffer} fileBuffer - 文件缓冲区
 * @param {string} fileName - 文件名
 * @param {string} folder - 存储文件夹（uploads 或 generated）
 * @returns {Promise<string>} - 返回文件的访问 URL
 */
const uploadFile = async (fileBuffer, fileName, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const key = `${folder}/${fileName}`;
    
    cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key,
      Body: fileBuffer,
      ContentLength: fileBuffer.length,
    }, (err, data) => {
      if (err) {
        console.error('COS 上传失败:', err);
        reject(err);
      } else {
        const url = `${cosConfig.BaseUrl}/${key}`;
        console.log('COS 上传成功:', url);
        resolve(url);
      }
    });
  });
};

/**
 * 从 COS 删除文件
 * @param {string} fileUrl - 文件的完整 URL
 * @returns {Promise<boolean>}
 */
const deleteFile = async (fileUrl) => {
  return new Promise((resolve, reject) => {
    try {
      // 从 URL 中提取 Key
      const urlObj = new URL(fileUrl);
      const key = urlObj.pathname.substring(1); // 移除开头的 /
      
      cos.deleteObject({
        Bucket: cosConfig.Bucket,
        Region: cosConfig.Region,
        Key: key,
      }, (err, data) => {
        if (err) {
          console.error('COS 删除失败:', err);
          reject(err);
        } else {
          console.log('COS 删除成功:', key);
          resolve(true);
        }
      });
    } catch (error) {
      console.error('解析 URL 失败:', error);
      reject(error);
    }
  });
};

/**
 * 批量删除文件
 * @param {Array<string>} fileUrls - 文件 URL 数组
 * @returns {Promise<boolean>}
 */
const deleteFiles = async (fileUrls) => {
  try {
    const deletePromises = fileUrls.map(url => deleteFile(url));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('批量删除失败:', error);
    throw error;
  }
};

/**
 * 生成唯一的文件名
 * @param {string} originalName - 原始文件名
 * @returns {string} - 新的文件名
 */
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const ext = path.extname(originalName);
  return `${timestamp}-${random}${ext}`;
};

module.exports = {
  cos,
  cosConfig,
  uploadFile,
  deleteFile,
  deleteFiles,
  generateFileName,
};


