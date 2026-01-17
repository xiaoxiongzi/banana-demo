<template>
  <button
    @click="handleGenerate"
    :disabled="disabled || isGenerating"
    :class="[
      'w-full py-3.5 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg',
      disabled || isGenerating
        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
        : 'bg-gradient-to-r from-banana-500 to-orange-500 hover:from-banana-600 hover:to-orange-600 text-white shadow-banana-500/30 hover:-translate-y-1'
    ]"
  >
    <span v-if="isGenerating" class="flex items-center justify-center">
      <span class="inline-block w-5 h-5 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      正在创作中...
    </span>
    <!-- <span v-else-if="!isAuthenticated">请先登录使用</span> -->
    <span v-else-if="disabled">{{ disabledReason }}</span>
    <span v-else>✨ 开始生成</span>
  </button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'GenerateButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    disabledReason: {
      type: String,
      default: '请填写完整信息'
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('generation', ['isGenerating'])
  },
  methods: {
    handleGenerate() {
      // if (!this.isAuthenticated) {
      //   this.$router.push('/login');
      //   return;
      // }
      
      if (!this.disabled && !this.isGenerating) {
        this.$emit('generate');
      }
    }
  }
};
</script>

