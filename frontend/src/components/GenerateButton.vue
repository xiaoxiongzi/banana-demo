<template>
  <button
    @click="handleGenerate"
    :disabled="disabled || isGenerating"
    :class="[
      'w-full py-4 rounded-xl font-semibold text-lg transition duration-300 shadow-md hover:shadow-lg',
      disabled || isGenerating
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-primary hover:bg-orange-600 text-white'
    ]"
  >
    <span v-if="isGenerating" class="flex items-center justify-center">
      <span class="loading-spinner inline-block w-5 h-5 mr-2"></span>
      生成中...
    </span>
    <span v-else-if="!isAuthenticated">请先登录使用</span>
    <span v-else-if="disabled">{{ disabledReason }}</span>
    <span v-else>🎨 开始生成</span>
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
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      
      if (!this.disabled && !this.isGenerating) {
        this.$emit('generate');
      }
    }
  }
};
</script>

