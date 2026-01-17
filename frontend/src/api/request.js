import axios from 'axios';
import store from '@/store';
import router from '@/router';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 120000, // 增加超时时间到 120 秒
  headers: {
    'Content-Type': 'application/json'
  }
});

// 不需要处理 401 重定向的路径
const authPaths = ['/login', '/register'];

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
        // 清除认证状态
        store.dispatch('auth/logout');
        
        // 获取当前路径
        const currentPath = router.currentRoute?.path || window.location.pathname;
        
        // 如果不在登录/注册页面，显示登录弹窗
        if (!authPaths.includes(currentPath)) {
          store.dispatch('ui/showAuthModal', {
            mode: 'login',
            redirect: currentPath
          });
        }
        
        // 不再使用 window.location.href 强制跳转，避免循环重定向
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

