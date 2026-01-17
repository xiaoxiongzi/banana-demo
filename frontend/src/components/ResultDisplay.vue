<template>
  <div class="bg-slate-50 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col relative overflow-hidden min-h-[420px] h-full">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm z-10">
      <h3 class="font-bold text-slate-800 text-sm">生成结果</h3>
      <div v-if="result" class="flex items-center gap-2">
        <button
          @click="downloadImage"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          下载
        </button>
        <button
          @click="regenerate"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          重新生成
        </button>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="flex-1 flex items-center justify-center p-4">
      <!-- 加载状态 -->
      <div v-if="isGenerating" class="flex flex-col items-center justify-center text-center animate-pulse">
        <div class="w-24 h-24 mb-6 relative">
          <div class="absolute inset-0 bg-banana-400 rounded-full animate-ping opacity-20"></div>
          <div class="absolute inset-0 bg-gradient-to-tr from-banana-300 to-orange-400 rounded-full flex items-center justify-center text-white shadow-xl">
            <span class="w-10 h-10 border-4 border-white/50 border-t-white rounded-full animate-spin"></span>
          </div>
        </div>
        <h4 class="text-xl font-bold text-banana-800 mb-2">AI 正在绘制...</h4>
        <p class="text-banana-600/70 text-sm">正在处理细节，请稍候</p>
      </div>
      
      <!-- 生成结果 -->
      <div v-else-if="result" class="w-full h-full flex flex-col items-center justify-center relative">
        <!-- 图片容器 -->
        <div class="relative w-full h-full flex items-center justify-center bg-slate-100/50 rounded-xl overflow-hidden">
          <!-- 棋盘格背景（用于透明图片） -->
          <div class="absolute inset-0 opacity-30" style="background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px;"></div>
          
          <img
            :src="result.imageUrl"
            alt="生成的图片"
            class="max-w-full max-h-full object-contain relative z-10 rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 mb-6 relative grayscale opacity-50">
          <div class="absolute inset-0 bg-banana-200 rounded-full opacity-20"></div>
          <div class="w-full h-full flex items-center justify-center text-3xl relative z-10">🎨</div>
        </div>
        
        <h4 class="text-lg font-bold text-slate-800 mb-2">准备就绪</h4>
        <p class="text-slate-500 text-sm whitespace-nowrap max-w-[320px]">
          输入描述并点击生成，奇迹即将发生
        </p>
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

