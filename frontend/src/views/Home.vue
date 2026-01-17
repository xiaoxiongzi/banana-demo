<template>
  <div class="min-h-screen flex flex-col text-slate-800">
    <Header />
    
    <main class="flex-1">
      <!-- Hero Section -->
      <section class="py-10 md:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Nano Banana AI: 排名第一的 <span class="text-banana-600">AI 图像编辑工具</span>
          </h1>
          <p class="text-slate-600 max-w-2xl mx-auto">
            快速编辑、调整和优化您的图片！最佳图像到图像AI模型。优于 Flux、Qwen、Image-1
          </p>
          <div class="mt-4">
            <span class="inline-block px-4 py-1.5 rounded-full bg-banana-200/50 text-banana-800 text-sm font-semibold border border-banana-200">
              由 Nano Banana 提供支持的AI图片编辑器
            </span>
          </div>
        </div>
      </section>
      
      <!-- Main Content -->
      <section class="pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Mode Switcher -->
          <div class="flex justify-center gap-4 mb-6">
            <button class="bg-gradient-to-r from-banana-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transform active:scale-95 transition-all">
              🖼️ 单图生成
            </button>
            <button class="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
              🧩 批量生成
            </button>
          </div>
          
          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[800px]">
            <!-- Left: Image Upload -->
            <div class="lg:col-span-3">
              <ImageUploader />
            </div>
            
            <!-- Center: Controls & Prompt -->
            <div class="lg:col-span-5 bg-white rounded-2xl p-6 border border-banana-100 shadow-sm flex flex-col overflow-y-auto custom-scrollbar">
              <div class="mb-6">
                <ModelSelector />
              </div>
              <div class="mb-6">
                <AspectRatioSelector />
              </div>
              
              <!-- Resolution -->
              <div class="mb-6">
                <h3 class="font-bold text-slate-800 mb-3">分辨率</h3>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="res in resolutions"
                    :key="res"
                    @click="selectResolution(res)"
                    :class="[
                      'py-1.5 px-3 rounded text-sm font-bold border transition-all',
                      selectedResolution === res
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    ]"
                  >
                    {{ res }}
                  </button>
                </div>
              </div>
              
              <!-- Prompt -->
              <div class="flex-grow flex flex-col">
                <h3 class="font-bold text-slate-800 mb-3">描述需求</h3>
                <div class="relative flex-grow">
                  <textarea
                    v-model="prompt"
                    class="w-full h-full min-h-[140px] p-4 rounded-xl border border-slate-200 focus:border-banana-400 focus:ring-4 focus:ring-banana-100 outline-none resize-none text-slate-700 text-sm bg-slate-50/50 pb-10"
                    placeholder="描述您想要生成的图片，例如：一只可爱的小猫坐在彩虹上、未来城市的夜景、油画风格的向日葵...越详细越好。"
                  ></textarea>
                  <div class="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] text-orange-500 bg-white/80 px-2 py-1 rounded border border-orange-100 pointer-events-none">
                    ⚠️ 严禁生成违规内容
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <GenerateButton
                  :disabled="!canGenerate"
                  :disabled-reason="disabledReason"
                  @generate="handleGenerate"
                />
              </div>
            </div>
            
            <!-- Right: Result -->
            <div class="lg:col-span-4">
              <ResultDisplay @regenerate="handleGenerate" />
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import ModelSelector from '@/components/ModelSelector.vue';
import AspectRatioSelector from '@/components/AspectRatioSelector.vue';
import GenerateButton from '@/components/GenerateButton.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import { generateImage } from '@/api/generate';

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    ImageUploader,
    ModelSelector,
    AspectRatioSelector,
    GenerateButton,
    ResultDisplay
  },
  data() {
    return {
      resolutions: ['1K', '2K', '4K'],
      selectedResolution: '1K'
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('generation', ['config', 'isGenerating']),
    prompt: {
      get() {
        return this.config.prompt;
      },
      set(value) {
        this.$store.dispatch('generation/updatePrompt', value);
      }
    },
    canGenerate() {
      // return this.isAuthenticated && this.prompt.trim().length > 0 && !this.isGenerating;
      return this.prompt.trim().length > 0 && !this.isGenerating;
    },
    disabledReason() {
      // if (!this.isAuthenticated) {
      //   return '请先登录';
      // }
      if (!this.prompt.trim()) {
        return '请输入图片描述';
      }
      return '请填写完整信息';
    }
  },
  methods: {
    selectResolution(resolution) {
      this.selectedResolution = resolution;
    },
    async handleGenerate() {
      if (!this.canGenerate) return;
      
      this.$store.dispatch('generation/setGenerating', true);
      
      try {
        const inputImages = (this.config.inputImages || []).filter(Boolean);
        const response = await generateImage({
          prompt: this.config.prompt,
          model: this.config.model,
          aspectRatio: this.config.aspectRatio,
          inputImages
        });
        
        if (response.success) {
          this.$store.dispatch('generation/setResult', response.data);
          this.$store.dispatch('user/updateCredits', response.data.remainingCredits);
          this.$store.dispatch('ui/showSuccess', '图片生成成功！');
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '图片生成失败');
      } finally {
        this.$store.dispatch('generation/setGenerating', false);
      }
    }
  }
};
</script>

