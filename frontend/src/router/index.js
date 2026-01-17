import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'Nano Banana AI - 排名第一的 AI 图像编辑工具' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth.vue'),
    meta: { title: '登录 - Nano Banana AI', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth.vue'),
    meta: { title: '注册 - Nano Banana AI', guest: true }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('@/views/Pricing.vue'),
    meta: { title: '套餐购买 - Nano Banana AI' }
  },
  {
    path: '/credits',
    name: 'Credits',
    component: () => import('@/views/Credits.vue'),
    meta: { title: '兑换积分 - Nano Banana AI', requiresAuth: true }
  },
  {
    path: '/api-doc',
    name: 'ApiDoc',
    component: () => import('@/views/ApiDoc.vue'),
    meta: { title: 'API 文档 - Nano Banana AI' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    meta: { title: '联系我们 - Nano Banana AI' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人中心 - Nano Banana AI', requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'Nano Banana AI';
  
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  // 需要认证的路由
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 显示登录弹窗而不是跳转页面
    store.dispatch('ui/showAuthModal', { 
      mode: 'login', 
      redirect: to.fullPath 
    });
    // 阻止导航，保持在当前页面
    next(false);
    return;
  }
  
  // 游客路由（已登录用户不能访问）- 重定向到首页
  if (to.meta.guest && isAuthenticated) {
    next('/');
    return;
  }
  
  next();
});

export default router;

