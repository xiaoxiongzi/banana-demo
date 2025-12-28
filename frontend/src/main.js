import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/styles/main.css';

Vue.config.productionTip = false;

// 全局错误处理
Vue.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, info);
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

