<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="card">
          <!-- Logo -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Nano Banana</h2>
            <p class="mt-2 text-gray-600">AI 图像编辑工具</p>
          </div>
          
          <!-- Tab Switch -->
          <div class="flex border-b mb-6">
            <button
              @click="mode = 'login'"
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
              @click="mode = 'register'"
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
                @click="mode = mode === 'login' ? 'register' : 'login'"
                class="text-primary hover:text-primary-600 font-semibold"
              >
                {{ mode === 'login' ? '立即注册' : '立即登录' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'Auth',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      mode: 'login',
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
  created() {
    // 根据路由设置模式
    if (this.$route.name === 'Register') {
      this.mode = 'register';
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      
      try {
        await this.$store.dispatch('auth/login', {
          email: this.loginForm.email,
          password: this.loginForm.password
        });
        
        this.$store.dispatch('ui/showSuccess', '登录成功！');
        
        // 重定向
        const redirect = this.$route.query.redirect || '/';
        this.$router.push(redirect);
        
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
        
        // 重定向
        const redirect = this.$route.query.redirect || '/';
        this.$router.push(redirect);
        
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '注册失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

