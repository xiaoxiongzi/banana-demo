import api from './request';

/**
 * 生成图片
 */
export const generateImage = (data) => {
  return api.post('/generate', data);
};

/**
 * 获取模型列表
 */
export const getModels = () => {
  return api.get('/generate/models');
};

