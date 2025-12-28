<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">套餐购买</h1>
          <p class="text-lg text-gray-600">选择适合您的套餐，开启AI创作之旅</p>
        </div>
        
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="loading-spinner mx-auto"></div>
        </div>
        
        <!-- Packages Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="pkg in packages"
            :key="pkg.id"
            class="card hover:shadow-xl transition duration-300"
            :class="pkg.id === 'premium' ? 'ring-2 ring-primary' : ''"
          >
            <!-- Badge -->
            <div v-if="pkg.id === 'premium'" class="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
              推荐
            </div>
            
            <!-- Package Info -->
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ pkg.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ pkg.description }}</p>
              
              <div class="mb-4">
                <span class="text-4xl font-bold text-primary">¥{{ pkg.amount }}</span>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-primary mb-1">{{ pkg.credits }}</div>
                <div class="text-sm text-gray-600">积分</div>
              </div>
              
              <div v-if="pkg.discount" class="mt-2 text-sm text-green-600 font-semibold">
                省 {{ Math.round(pkg.discount * 100) }}%
              </div>
            </div>
            
            <!-- Features -->
            <ul class="space-y-2 mb-6 text-sm">
              <li class="flex items-center text-gray-700">
                <span class="text-green-500 mr-2">✓</span>
                所有 AI 模型
              </li>
              <li class="flex items-center text-gray-700">
                <span class="text-green-500 mr-2">✓</span>
                无限次生成
              </li>
              <li class="flex items-center text-gray-700">
                <span class="text-green-500 mr-2">✓</span>
                高清输出
              </li>
              <li class="flex items-center text-gray-700">
                <span class="text-green-500 mr-2">✓</span>
                {{ pkg.id === 'enterprise' ? '优先支持' : '标准支持' }}
              </li>
            </ul>
            
            <!-- Buy Button -->
            <button
              @click="handleBuy(pkg)"
              :disabled="purchasing"
              class="w-full py-3 rounded-lg font-semibold transition"
              :class="pkg.id === 'premium'
                ? 'bg-primary hover:bg-primary-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
            >
              {{ purchasing ? '处理中...' : '立即购买' }}
            </button>
          </div>
        </div>
        
        <!-- FAQ -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">常见问题</h2>
          <div class="max-w-3xl mx-auto space-y-4">
            <div class="card">
              <h3 class="font-semibold text-gray-900 mb-2">积分如何使用？</h3>
              <p class="text-gray-600 text-sm">每次生成图片会根据选择的模型消耗相应积分。Banana 模型 10 积分/次，Banana Pro 20 积分/次，Banana Pro Stable 25 积分/次。</p>
            </div>
            <div class="card">
              <h3 class="font-semibold text-gray-900 mb-2">积分会过期吗？</h3>
              <p class="text-gray-600 text-sm">不会。购买的积分永久有效，可以随时使用。</p>
            </div>
            <div class="card">
              <h3 class="font-semibold text-gray-900 mb-2">支持哪些支付方式？</h3>
              <p class="text-gray-600 text-sm">支持支付宝、微信支付、信用卡等多种支付方式。</p>
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
import { getPackages, createOrder } from '@/api/order';

export default {
  name: 'Pricing',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      loading: false,
      purchasing: false,
      packages: []
    };
  },
  created() {
    this.fetchPackages();
  },
  methods: {
    async fetchPackages() {
      this.loading = true;
      
      try {
        const response = await getPackages();
        if (response.success) {
          this.packages = response.data;
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', '获取套餐列表失败');
      } finally {
        this.loading = false;
      }
    },
    
    async handleBuy(pkg) {
      if (!this.$store.getters['auth/isAuthenticated']) {
        this.$store.dispatch('ui/showWarning', '请先登录');
        this.$router.push('/login');
        return;
      }
      
      this.purchasing = true;
      
      try {
        const response = await createOrder({
          packageType: pkg.id,
          paymentMethod: 'mock'
        });
        
        if (response.success) {
          this.$store.dispatch('user/updateCredits', response.data.totalCredits);
          this.$store.dispatch('ui/showSuccess', `购买成功！已获得 ${pkg.credits} 积分`);
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '购买失败');
      } finally {
        this.purchasing = false;
      }
    }
  }
};
</script>

