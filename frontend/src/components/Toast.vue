<template>
  <transition name="slide-fade">
    <div v-if="toast.show" :class="toastClasses" class="toast">
      <div class="flex items-center">
        <span class="text-2xl mr-3">{{ icon }}</span>
        <p class="flex-1">{{ toast.message }}</p>
        <button @click="hideToast" class="ml-3 text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Toast',
  computed: {
    ...mapGetters('ui', ['toast']),
    icon() {
      const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
      };
      return icons[this.toast.type] || icons.info;
    },
    toastClasses() {
      const baseClasses = 'toast border-l-4';
      const typeClasses = {
        success: 'border-green-500 bg-green-50',
        error: 'border-red-500 bg-red-50',
        warning: 'border-yellow-500 bg-yellow-50',
        info: 'border-blue-500 bg-blue-50'
      };
      return `${baseClasses} ${typeClasses[this.toast.type] || typeClasses.info}`;
    }
  },
  methods: {
    ...mapActions('ui', ['showToast']),
    hideToast() {
      this.$store.commit('ui/HIDE_TOAST');
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

