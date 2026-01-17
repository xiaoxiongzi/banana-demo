<template>
  <div class="min-h-screen flex flex-col text-slate-800">
    <Header />
    
    <main class="flex-1">
      <!-- Hero Section with Mode Switcher -->
      <section class="py-5 md:py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Left: Title & Subtitle -->
            <div class="text-center md:text-left">
              <h1 class="text-xl md:text-2xl font-extrabold text-slate-900 mb-0.5">
                Nano Banana AI: 排名第一的 <span class="text-banana-600">AI 图像编辑工具</span>
              </h1>
              <p class="text-slate-500 text-xs md:text-sm">
                快速编辑、调整和优化您的图片！最佳图像到图像AI模型。优于 Flux、Qwen、Image-1
              </p>
            </div>
            
            <!-- Right: Mode Switcher -->
            <div class="flex justify-center md:justify-end flex-shrink-0">
              <div class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <button class="bg-gradient-to-r from-banana-500 to-orange-500 text-white shadow-md shadow-orange-500/25 px-4 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 transform active:scale-95 transition-all">
                  🖼️ 单图生成
                </button>
                <button class="text-slate-600 hover:bg-slate-50 px-4 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 transition-colors">
                  🧩 批量生成
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Main Content -->
      <section class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-16 gap-6 h-auto lg:min-h-[720px]">
            <!-- Left: Image Upload -->
            <div class="lg:col-span-5">
              <ImageUploader />
            </div>
            
            <!-- Center: Controls & Prompt -->
            <div class="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex flex-col overflow-y-auto custom-scrollbar">
              <div class="space-y-4">
                <section class="pb-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-sm text-slate-800">模型选择</h3>
                    <span class="text-[13px] text-slate-500">推荐 Banana</span>
                  </div>
                  <ModelSelector />
                </section>

                <section class="pb-4">
                  <h3 class="font-bold text-sm text-slate-800 mb-2">图片尺寸</h3>
                  <AspectRatioSelector />
                </section>

                <!-- Resolution -->
                <section class="pb-4">
                  <h3 class="font-bold text-sm text-slate-800 mb-2">分辨率</h3>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="res in resolutions"
                      :key="res"
                      @click="selectResolution(res)"
                      :class="[
                        'px-3 rounded text-[13px] font-bold border transition-all',
                        selectedResolution === res
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      ]"
                      style="height: 32px;"
                    >
                      {{ res }}
                    </button>
                  </div>
                </section>

                <!-- Prompt -->
                <section class="flex-grow flex flex-col">
                  <h3 class="font-bold text-sm text-slate-800 mb-2">描述需求</h3>
                  <div class="relative flex-grow">
                    <textarea
                      v-model="prompt"
                      class="w-full h-full min-h-[160px] p-4 rounded-xl border border-slate-200 focus:border-banana-400 focus:ring-4 focus:ring-banana-100 outline-none resize-none text-slate-700 text-[13px] bg-white pb-10"
                      placeholder="描述您想要生成的图片，例如：一只可爱的小猫坐在彩虹上、未来城市的夜景、油画风格的向日葵...越详细越好。"
                    ></textarea>
                    <div class="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-orange-500 bg-white/90 px-2 py-1 rounded border border-orange-100 pointer-events-none">
                      ⚠️ 严禁生成违规内容
                    </div>
                  </div>
                </section>
              </div>

              <div class="mt-6">
                <GenerateButton
                  :disabled="!canGenerate"
                  :disabled-reason="disabledReason"
                  @generate="handleGenerate"
                />
              </div>
              
              <!-- Brand Badge -->
              <div class="mt-2 pt-2 w-full">
                <span class="block w-full text-center text-[11px] font-semibold text-banana-800 bg-banana-200/60 border border-banana-200/80 px-2.5 py-1 rounded-lg">
                  由 Nano Banana 提供支持的AI图片编辑器
                </span>
              </div>
            </div>
            
            <!-- Right: Result -->
            <div class="lg:col-span-6">
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
      selectedResolution: '1K',
      modelLabels: {
        banana: 'Banana',
        'banana-pro': 'Banana Pro'
      }
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
    },
    selectedModelLabel() {
      return this.modelLabels[this.config.model] || this.config.model || 'Banana';
    },
    selectedAspectRatioLabel() {
      return this.config.aspectRatio || '1:1';
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

