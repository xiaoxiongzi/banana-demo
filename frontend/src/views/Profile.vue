<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">个人中心</h1>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- User Info Card -->
            <div class="card text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-primary to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
                {{ user.username ? user.username.charAt(0).toUpperCase() : '👤' }}
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-1">{{ user.username }}</h2>
              <p class="text-gray-600 text-sm mb-4">{{ user.email }}</p>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <div class="text-3xl font-bold text-primary mb-1">{{ credits }}</div>
                <div class="text-sm text-gray-600">积分余额</div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="card">
              <h3 class="font-semibold text-gray-900 mb-4">快捷操作</h3>
              <div class="space-y-2">
                <router-link
                  to="/pricing"
                  class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  💎 购买积分
                </router-link>
                <router-link
                  to="/credits"
                  class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  🎟️ 兑换积分
                </router-link>
                <router-link
                  to="/"
                  class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  🎨 开始创作
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Right Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div class="card text-center">
                <div class="text-3xl font-bold text-primary mb-1">{{ stats.totalGenerations }}</div>
                <div class="text-sm text-gray-600">总生成次数</div>
              </div>
              <div class="card text-center">
                <div class="text-3xl font-bold text-primary mb-1">{{ stats.totalCreditsUsed }}</div>
                <div class="text-sm text-gray-600">总消耗积分</div>
              </div>
            </div>
            
            <!-- Tabs -->
            <div class="card">
              <div class="flex border-b mb-6">
                <button
                  @click="activeTab = 'history'"
                  :class="[
                    'flex-1 py-3 text-center font-semibold transition',
                    activeTab === 'history'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  生成历史
                </button>
                <button
                  @click="activeTab = 'orders'"
                  :class="[
                    'flex-1 py-3 text-center font-semibold transition',
                    activeTab === 'orders'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  订单记录
                </button>
              </div>
              
              <!-- History Tab -->
              <div v-if="activeTab === 'history'">
                <div v-if="loadingHistory" class="text-center py-8">
                  <div class="loading-spinner mx-auto"></div>
                </div>
                
                <div v-else-if="histories.length === 0" class="text-center py-8 text-gray-500">
                  暂无生成历史
                </div>
                
                <div v-else class="space-y-4">
                  <div
                    v-for="item in histories"
                    :key="item._id"
                    class="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div class="flex items-start space-x-4">
                      <img
                        :src="item.outputImage"
                        alt="生成的图片"
                        class="w-24 h-24 object-cover rounded-lg"
                      />
                      <div class="flex-1">
                        <p class="text-gray-900 font-medium mb-1">{{ item.prompt }}</p>
                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                          <span>模型: {{ item.model }}</span>
                          <span>尺寸: {{ item.aspectRatio }}</span>
                          <span>消耗: {{ item.creditsUsed }} 积分</span>
                        </div>
                        <div class="text-xs text-gray-400 mt-1">
                          {{ formatDate(item.createdAt) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Orders Tab -->
              <div v-if="activeTab === 'orders'">
                <div v-if="loadingOrders" class="text-center py-8">
                  <div class="loading-spinner mx-auto"></div>
                </div>
                
                <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-500">
                  暂无订单记录
                </div>
                
                <div v-else class="space-y-4">
                  <div
                    v-for="order in orders"
                    :key="order._id"
                    class="border rounded-lg p-4"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <div class="font-semibold text-gray-900">{{ getPackageName(order.packageType) }}</div>
                        <div class="text-sm text-gray-500">订单号: {{ order._id }}</div>
                      </div>
                      <span
                        :class="[
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ getStatusText(order.status) }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">积分: {{ order.credits }}</span>
                      <span class="text-gray-900 font-semibold">¥{{ order.amount }}</span>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatDate(order.createdAt) }}
                    </div>
                  </div>
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
import { mapGetters } from 'vuex';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { getHistory, getStats } from '@/api/history';
import { getOrders } from '@/api/order';

export default {
  name: 'Profile',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      activeTab: 'history',
      loadingHistory: false,
      loadingOrders: false,
      histories: [],
      orders: [],
      stats: {
        totalGenerations: 0,
        totalCreditsUsed: 0
      }
    };
  },
  computed: {
    ...mapGetters('user', ['user', 'credits'])
  },
  created() {
    this.fetchStats();
    this.fetchHistory();
    this.fetchOrders();
  },
  methods: {
    async fetchStats() {
      try {
        const response = await getStats();
        if (response.success) {
          this.stats = response.data;
        }
      } catch (error) {
        console.error('获取统计失败:', error);
      }
    },
    
    async fetchHistory() {
      this.loadingHistory = true;
      
      try {
        const response = await getHistory({ limit: 10 });
        if (response.success) {
          this.histories = response.data.histories;
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', '获取生成历史失败');
      } finally {
        this.loadingHistory = false;
      }
    },
    
    async fetchOrders() {
      this.loadingOrders = true;
      
      try {
        const response = await getOrders({ limit: 10 });
        if (response.success) {
          this.orders = response.data.orders;
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', '获取订单记录失败');
      } finally {
        this.loadingOrders = false;
      }
    },
    
    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN');
    },
    
    getPackageName(type) {
      const names = {
        basic: '基础套餐',
        pro: '专业套餐',
        premium: '高级套餐',
        enterprise: '企业套餐'
      };
      return names[type] || type;
    },
    
    getStatusText(status) {
      const texts = {
        pending: '待支付',
        completed: '已完成',
        failed: '失败',
        cancelled: '已取消'
      };
      return texts[status] || status;
    }
  }
};
</script>

