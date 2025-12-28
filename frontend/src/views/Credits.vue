<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">兑换积分</h1>
          <p class="text-lg text-gray-600">使用兑换码获取免费积分</p>
        </div>
        
        <!-- Current Credits -->
        <div class="card mb-8 text-center">
          <div class="text-gray-600 mb-2">当前积分余额</div>
          <div class="text-5xl font-bold text-primary">{{ credits }}</div>
        </div>
        
        <!-- Redeem Form -->
        <div class="card">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">输入兑换码</h2>
          
          <form @submit.prevent="handleRedeem" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                兑换码
              </label>
              <input
                v-model="redeemCode"
                type="text"
                required
                placeholder="请输入12位兑换码，例如：ABCD-EFGH-IJKL"
                class="input-field uppercase"
                maxlength="14"
              />
              <p class="text-sm text-gray-500 mt-2">
                兑换码格式：XXXX-XXXX-XXXX（不区分大小写）
              </p>
            </div>
            
            <button
              type="submit"
              :disabled="loading || !redeemCode.trim()"
              class="btn-primary w-full"
            >
              {{ loading ? '兑换中...' : '立即兑换' }}
            </button>
          </form>
        </div>
        
        <!-- How to Get -->
        <div class="mt-8 card bg-blue-50 border border-blue-200">
          <h3 class="font-semibold text-gray-900 mb-4">如何获取兑换码？</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>关注我们的官方社交媒体账号，参与活动获取</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>参加限时促销活动</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>推荐好友注册使用</span>
            </li>
            <li class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>参与社区贡献和反馈</span>
            </li>
          </ul>
        </div>
        
        <!-- Quick Actions -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            to="/pricing"
            class="card hover:shadow-lg transition text-center"
          >
            <div class="text-3xl mb-2">💎</div>
            <h3 class="font-semibold text-gray-900 mb-1">购买套餐</h3>
            <p class="text-sm text-gray-600">获取更多积分优惠</p>
          </router-link>
          
          <router-link
            to="/profile"
            class="card hover:shadow-lg transition text-center"
          >
            <div class="text-3xl mb-2">📊</div>
            <h3 class="font-semibold text-gray-900 mb-1">使用记录</h3>
            <p class="text-sm text-gray-600">查看积分使用历史</p>
          </router-link>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { redeemCode } from '@/api/credits';

export default {
  name: 'Credits',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      loading: false,
      redeemCode: ''
    };
  },
  computed: {
    ...mapGetters('user', ['credits'])
  },
  methods: {
    async handleRedeem() {
      if (!this.redeemCode.trim()) return;
      
      this.loading = true;
      
      try {
        const response = await redeemCode(this.redeemCode);
        
        if (response.success) {
          this.$store.dispatch('user/updateCredits', response.data.totalCredits);
          this.$store.dispatch('ui/showSuccess', response.message);
          this.redeemCode = '';
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '兑换失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

