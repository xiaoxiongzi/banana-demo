import api from './request';

/**
 * 用户注册
 */
export const register = (data) => {
  return api.post('/auth/register', data);
};

/**
 * 用户登录
 */
export const login = (data) => {
  return api.post('/auth/login', data);
};

/**
 * 获取用户信息
 */
export const getProfile = () => {
  return api.get('/auth/profile');
};

/**
 * 更新用户信息
 */
export const updateProfile = (data) => {
  return api.put('/auth/profile', data);
};

