import api from './request';

/**
 * 上传图片
 */
export const uploadImages = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 删除图片
 */
export const deleteImage = (filename) => {
  return api.delete(`/upload/${filename}`);
};

