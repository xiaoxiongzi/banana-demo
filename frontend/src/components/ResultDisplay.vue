<template>
  <div class="bg-[#FFFBF0] rounded-2xl border-2 border-banana-100 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px] h-full">
    <h3 class="absolute top-6 left-6 font-bold text-slate-800 z-10 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
      生成结果
    </h3>
    
    <div v-if="isGenerating" class="flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div class="w-24 h-24 mb-6 relative">
        <div class="absolute inset-0 bg-banana-400 rounded-full animate-ping opacity-20"></div>
        <div class="absolute inset-0 bg-gradient-to-tr from-banana-300 to-orange-400 rounded-full flex items-center justify-center text-white shadow-xl">
          <span class="w-10 h-10 border-4 border-white/50 border-t-white rounded-full animate-spin"></span>
        </div>
      </div>
      <h4 class="text-xl font-bold text-banana-800 mb-2">AI 正在绘制...</h4>
      <p class="text-banana-600/70 text-sm">正在处理光影细节，请稍候</p>
    </div>
    
    <div v-else-if="result" class="w-full h-full relative group">
      <img
        :src="result.imageUrl"
        alt="生成的图片"
        class="w-full h-full object-cover"
      />
      
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
        <button
          @click="downloadImage"
          class="bg-white text-slate-800 p-4 rounded-full shadow-xl hover:scale-110 transition-transform font-bold flex flex-col items-center justify-center gap-1 w-20 h-20"
        >
          ⬇️
          <span class="text-[10px]">下载</span>
        </button>
        <button
          @click="regenerate"
          class="bg-white/20 text-white border border-white/50 p-4 rounded-full shadow-xl hover:bg-white/30 transition-colors w-16 h-16 flex items-center justify-center backdrop-blur-md"
        >
          🔄
        </button>
      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center p-8 text-center">
      <div class="w-20 h-20 mb-6 relative grayscale opacity-50">
        <div class="absolute inset-0 bg-banana-200 rounded-full opacity-20"></div>
        <div class="w-full h-full flex items-center justify-center text-3xl relative z-10">🎨</div>
      </div>
      
      <h4 class="text-lg font-bold text-slate-800 mb-2">准备就绪</h4>
      <p class="text-slate-500 text-sm max-w-[200px]">
        输入描述并点击生成，奇迹即将发生
      </p>
    </div>
    
    <div v-if="!isGenerating && !result" class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
      <button class="bg-red-100 p-3 rounded-full shadow-lg border-4 border-white text-red-400 hover:scale-110 transition-transform cursor-not-allowed opacity-50">
        <span class="font-bold text-xs">R18</span>
      </button>
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

