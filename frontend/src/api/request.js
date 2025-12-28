import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      
      // 处理认证错误
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // 返回错误信息
      return Promise.reject(data || { message: '请求失败' });
    } else if (error.request) {
      return Promise.reject({ message: '网络错误，请检查您的连接' });
    } else {
      return Promise.reject({ message: error.message || '未知错误' });
    }
  }
);

export default api;

