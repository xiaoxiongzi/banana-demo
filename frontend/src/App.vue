<template>
  <div id="app" class="min-h-screen bg-banana-gradient">
    <router-view />
    <Toast />
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

export default {
  name: 'App',
  components: {
    Toast
  },
  created() {
    // 如果有 token，获取用户信息
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$store.dispatch('auth/fetchProfile');
    }
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

