<template>
  <header class="sticky top-0 z-40 w-full bg-banana-50/90 backdrop-blur-md border-b border-banana-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-gradient-to-br from-banana-400 to-banana-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm text-sm">
            N
          </div>
          <span class="text-lg font-bold text-banana-600 tracking-tight">Nano Banana</span>
        </router-link>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-5 text-sm font-semibold text-slate-600">
          <router-link to="/contact" class="hover:text-banana-600 transition-colors">
            联系我们
          </router-link>
          <router-link to="/pricing" class="hover:text-banana-600 transition-colors">
            套餐购买
          </router-link>
          <router-link to="/credits" class="hover:text-banana-600 transition-colors">
            兑换积分
          </router-link>
          <router-link to="/api-doc" class="hover:text-banana-600 transition-colors">
            API调用
          </router-link>
          
          <div class="h-3 w-px bg-slate-300 mx-2"></div>
          
          <div class="flex items-center gap-3">
            <template v-if="isAuthenticated">
              <router-link
                to="/pricing"
                class="cursor-pointer bg-banana-400 hover:bg-banana-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-all text-xs font-bold"
              >
                ⚡ 余额: {{ credits }} 积分
              </router-link>
              <div class="relative" ref="userMenu">
                <button
                  @click="toggleUserMenu"
                  class="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 cursor-pointer text-sm"
                >
                  👤
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
                class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-full shadow-lg shadow-banana-300/30 transition-all transform hover:scale-105 text-sm"
              >
                登录 / 注册
              </router-link>
            </template>
          </div>
        </nav>
        
        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-slate-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-banana-200">
        <nav class="flex flex-col space-y-3 text-sm font-semibold text-slate-600">
          <router-link
            to="/contact"
            class="hover:text-banana-600 transition-colors"
            @click.native="showMobileMenu = false"
          >
            联系我们
          </router-link>
          <router-link
            to="/pricing"
            class="hover:text-banana-600 transition-colors"
            @click.native="showMobileMenu = false"
          >
            套餐购买
          </router-link>
          <router-link
            to="/credits"
            class="hover:text-banana-600 transition-colors"
            @click.native="showMobileMenu = false"
          >
            兑换积分
          </router-link>
          <router-link
            to="/api-doc"
            class="hover:text-banana-600 transition-colors"
            @click.native="showMobileMenu = false"
          >
            API调用
          </router-link>
          
          <template v-if="isAuthenticated">
            <router-link
              to="/pricing"
              class="inline-flex items-center gap-1.5 bg-banana-400 text-white px-2.5 py-1 rounded-full text-xs font-bold w-fit"
              @click.native="showMobileMenu = false"
            >
              ⚡ 余额: {{ credits }} 积分
            </router-link>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="bg-slate-900 text-white px-4 py-1.5 rounded-full w-fit text-sm"
              @click.native="showMobileMenu = false"
            >
              登录 / 注册
            </router-link>
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

