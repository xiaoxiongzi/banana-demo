<template>
  <div class="result-display card min-h-[540px] flex flex-col">
    <h3 class="text-lg font-bold text-gray-800 mb-4">生成结果</h3>
    
    <div v-if="!result && !isGenerating" class="flex-1 flex flex-col items-center justify-center text-center">
      <span class="text-5xl mb-4 inline-block">🎨</span>
      <h4 class="font-semibold text-gray-800 mb-2">AI 生成结果将在这里显示</h4>
      <p class="text-sm text-gray-500">输入您想要生成的图片描述，点击"开始生成"即可创造精美图片</p>
    </div>
    
    <div v-else-if="isGenerating" class="flex-1 flex flex-col items-center justify-center text-center">
      <div class="loading-spinner mx-auto mb-4"></div>
      <p class="text-gray-600">正在生成中，请稍候...</p>
      <p class="text-sm text-gray-400 mt-2">这可能需要几秒钟时间</p>
    </div>
    
    <div v-else-if="result" class="space-y-4">
      <div class="relative group">
        <img
          :src="result.imageUrl"
          alt="生成的图片"
          class="w-full rounded-lg shadow-md"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition rounded-lg"></div>
      </div>
      
      <div class="flex items-center justify-between text-sm">
        <div class="text-gray-600">
          消耗积分: <span class="font-semibold text-primary">{{ result.creditsUsed }}</span>
        </div>
        <div class="text-gray-600">
          剩余积分: <span class="font-semibold">{{ result.remainingCredits }}</span>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="downloadImage"
          class="flex-1 bg-primary hover:bg-primary-600 text-white text-center py-2 rounded-lg transition"
        >
          下载图片
        </button>
        <button
          @click="regenerate"
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
        >
          重新生成
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ResultDisplay',
  computed: {
    ...mapGetters('generation', ['result', 'isGenerating'])
  },
  methods: {
    regenerate() {
      this.$emit('regenerate');
    },
    downloadImage() {
      if (!this.result || !this.result.imageUrl) return;
      
      // 创建一个临时链接来下载 base64 图片
      const link = document.createElement('a');
      link.href = this.result.imageUrl;
      link.download = `nano-banana-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

