<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- 遮罩层 -->
    <div 
      class="fixed inset-0 bg-black/50 transition-opacity"
      @click="closeModal"
    ></div>
    
    <!-- 弹窗内容 -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        @click.stop
      >
        <!-- 关闭按钮 -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div class="p-8">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-banana-400 to-banana-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg mx-auto mb-3 text-xl">
              N
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Nano Banana</h2>
            <p class="mt-1 text-gray-600 text-sm">AI 图像编辑工具</p>
          </div>
          
          <!-- Tab Switch -->
          <div class="flex border-b mb-6">
            <button
              @click="switchMode('login')"
              :class="[
                'flex-1 py-3 text-center font-semibold transition',
                mode === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              登录
            </button>
            <button
              @click="switchMode('register')"
              :class="[
                'flex-1 py-3 text-center font-semibold transition',
                mode === 'register'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              注册
            </button>
          </div>
          
          <!-- Login Form -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                placeholder="请输入邮箱"
                class="input-field"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                placeholder="请输入密码"
                class="input-field"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>
          
          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                v-model="registerForm.username"
                type="text"
                required
                minlength="3"
                maxlength="30"
                placeholder="请输入用户名（3-30个字符）"
                class="input-field"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                placeholder="请输入邮箱"
                class="input-field"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                minlength="6"
                placeholder="请输入密码（至少6个字符）"
                class="input-field"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                required
                placeholder="请再次输入密码"
                class="input-field"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </form>
          
          <!-- Tips -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              {{ mode === 'login' ? '还没有账号？' : '已有账号？' }}
              <button
                @click="switchMode(mode === 'login' ? 'register' : 'login')"
                class="text-primary hover:text-primary-600 font-semibold"
              >
                {{ mode === 'login' ? '立即注册' : '立即登录' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AuthModal',
  data() {
    return {
      loading: false,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  computed: {
    ...mapGetters('ui', ['showAuthModal', 'authModalMode', 'authModalRedirect']),
    show() {
      return this.showAuthModal;
    },
    mode() {
      return this.authModalMode;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // 打开弹窗时禁止背景滚动
        document.body.style.overflow = 'hidden';
      } else {
        // 关闭弹窗时恢复背景滚动
        document.body.style.overflow = '';
        // 重置表单
        this.resetForms();
      }
    }
  },
  methods: {
    closeModal() {
      this.$store.dispatch('ui/hideAuthModal');
    },
    switchMode(mode) {
      this.$store.dispatch('ui/setAuthModalMode', mode);
    },
    resetForms() {
      this.loginForm = { email: '', password: '' };
      this.registerForm = { username: '', email: '', password: '', confirmPassword: '' };
      this.loading = false;
    },
    async handleLogin() {
      this.loading = true;
      
      try {
        await this.$store.dispatch('auth/login', {
          email: this.loginForm.email,
          password: this.loginForm.password
        });
        
        this.$store.dispatch('ui/showSuccess', '登录成功！');
        
        // 关闭弹窗
        this.closeModal();
        
        // 如果有重定向路径
        if (this.authModalRedirect) {
          this.$router.push(this.authModalRedirect);
        }
        
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '登录失败');
      } finally {
        this.loading = false;
      }
    },
    
    async handleRegister() {
      // 验证密码
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$store.dispatch('ui/showError', '两次输入的密码不一致');
        return;
      }
      
      this.loading = true;
      
      try {
        await this.$store.dispatch('auth/register', {
          username: this.registerForm.username,
          email: this.registerForm.email,
          password: this.registerForm.password
        });
        
        this.$store.dispatch('ui/showSuccess', '注册成功！已自动登录');
        
        // 关闭弹窗
        this.closeModal();
        
        // 如果有重定向路径
        if (this.authModalRedirect) {
          this.$router.push(this.authModalRedirect);
        }
        
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '注册失败');
      } finally {
        this.loading = false;
      }
    }
  },
  beforeDestroy() {
    // 确保组件销毁时恢复滚动
    document.body.style.overflow = '';
  }
};
</script>
