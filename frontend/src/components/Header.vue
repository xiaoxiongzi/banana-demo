<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <span class="text-2xl font-bold" style="color: #FF8C00;">Nano Banana</span>
        </router-link>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link to="/contact" class="text-gray-600 hover:text-primary transition font-medium">
            联系我们
          </router-link>
          <router-link to="/pricing" class="text-gray-600 hover:text-primary transition font-medium">
            套餐购买
          </router-link>
          <router-link to="/credits" class="text-gray-600 hover:text-primary transition font-medium">
            兑换积分
          </router-link>
          <router-link to="/api-doc" class="text-gray-600 hover:text-primary transition font-medium">
            API调用
          </router-link>
        </nav>
        
        <!-- User Info / Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <div class="hidden md:flex items-center space-x-3 bg-yellow-100 px-4 py-2 rounded-full">
              <span class="text-sm">💰</span>
              <span class="text-sm font-semibold">余额: {{ credits }}积分</span>
            </div>
            <div class="relative" ref="userMenu">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-600 transition"
              >
                <span class="text-sm">👤</span>
                <span class="hidden md:inline text-sm">{{ username }}</span>
              </button>
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click.native="showUserMenu = false"
                >
                  个人中心
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  退出登录
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="hidden md:inline-block px-6 py-2 border-2 border-primary text-primary rounded-full hover:bg-orange-50 transition font-medium"
            >
              登录
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-2 bg-primary text-white rounded-full hover:bg-orange-600 transition font-medium"
            >
              注册
            </router-link>
          </template>
          
          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden text-gray-700 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t">
        <nav class="flex flex-col space-y-3">
          <router-link
            to="/contact"
            class="text-gray-700 hover:text-primary transition"
            @click.native="showMobileMenu = false"
          >
            联系我们
          </router-link>
          <router-link
            to="/pricing"
            class="text-gray-700 hover:text-primary transition"
            @click.native="showMobileMenu = false"
          >
            套餐购买
          </router-link>
          <router-link
            to="/credits"
            class="text-gray-700 hover:text-primary transition"
            @click.native="showMobileMenu = false"
          >
            兑换积分
          </router-link>
          <router-link
            to="/api-doc"
            class="text-gray-700 hover:text-primary transition"
            @click.native="showMobileMenu = false"
          >
            API调用
          </router-link>
          <template v-if="isAuthenticated">
            <div class="flex items-center space-x-3 bg-yellow-100 px-4 py-2 rounded-full">
              <span class="text-sm">💰</span>
              <span class="text-sm font-semibold">余额: {{ credits }}积分</span>
            </div>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      showUserMenu: false,
      showMobileMenu: false
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('user', ['username', 'credits'])
  },
  methods: {
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    handleLogout() {
      this.$store.dispatch('auth/logout');
      this.showUserMenu = false;
      this.$router.push('/');
      this.$store.dispatch('ui/showSuccess', '已退出登录');
    }
  },
  mounted() {
    // 点击外部关闭用户菜单
    document.addEventListener('click', (e) => {
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(e.target)) {
        this.showUserMenu = false;
      }
    });
  }
};
</script>

