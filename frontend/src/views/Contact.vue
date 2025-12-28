<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p class="text-lg text-gray-600">我们随时准备为您提供帮助</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Contact Form -->
          <div class="card">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">发送消息</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="请输入您的姓名"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="请输入您的邮箱"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  主题
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  placeholder="请输入主题"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  消息内容
                </label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  placeholder="请详细描述您的问题或建议"
                  class="input-field resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary w-full"
              >
                {{ loading ? '发送中...' : '发送消息' }}
              </button>
            </form>
          </div>
          
          <!-- Contact Info -->
          <div class="space-y-6">
            <!-- Info Card -->
            <div class="card">
              <h3 class="font-semibold text-gray-900 mb-4">联系方式</h3>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="text-2xl mr-3">📧</div>
                  <div>
                    <div class="font-semibold text-gray-900">邮箱</div>
                    <div class="text-gray-600">support@banana.147ai.com</div>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="text-2xl mr-3">💬</div>
                  <div>
                    <div class="font-semibold text-gray-900">在线客服</div>
                    <div class="text-gray-600">周一至周五 9:00-18:00</div>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="text-2xl mr-3">🐦</div>
                  <div>
                    <div class="font-semibold text-gray-900">社交媒体</div>
                    <div class="text-gray-600">@NanoBananaAI</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- FAQ Link -->
            <div class="card bg-blue-50 border border-blue-200">
              <h3 class="font-semibold text-gray-900 mb-2">常见问题</h3>
              <p class="text-gray-700 text-sm mb-4">
                在联系我们之前，您可以先查看常见问题解答，可能会找到您需要的答案。
              </p>
              <router-link
                to="/pricing"
                class="text-primary hover:text-primary-600 font-semibold text-sm"
              >
                查看常见问题 →
              </router-link>
            </div>
            
            <!-- Business Hours -->
            <div class="card">
              <h3 class="font-semibold text-gray-900 mb-4">工作时间</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">周一 - 周五</span>
                  <span class="font-semibold">9:00 - 18:00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">周六 - 周日</span>
                  <span class="font-semibold">10:00 - 16:00</span>
                </div>
              </div>
            </div>
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
  name: 'Contact',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      
      try {
        // 模拟发送
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.$store.dispatch('ui/showSuccess', '消息已发送！我们会尽快回复您。');
        
        // 重置表单
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      } catch (error) {
        this.$store.dispatch('ui/showError', '发送失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

