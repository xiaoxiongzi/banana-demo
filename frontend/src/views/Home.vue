<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1">
      <!-- Hero Section -->
      <section class="py-12 md:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Nano Banana AI：排名第一的 <span style="color: #FF8C00;">AI 图像编辑工具</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-500 mb-6">
            快速编辑、调整和优化您的图片！最佳图像到图像AI模型。优于 Flux、Qwen、Image-1
          </p>
          <div class="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md">
            <span class="text-sm text-gray-600">🖼️ 由 Nano Banana 提供支持的AI图片编辑器</span>
          </div>
        </div>
      </section>
      
      <!-- Main Content -->
      <section class="pb-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Desktop Layout: 3 Columns -->
          <div class="hidden lg:grid lg:grid-cols-3 gap-6">
            <!-- Left Column: Image Upload -->
            <div class="space-y-6">
              <ImageUploader />
            </div>
            
            <!-- Middle Column: Configuration -->
            <div class="space-y-6">
              <div class="card">
                <ModelSelector />
              </div>
              <div class="card">
                <AspectRatioSelector />
              </div>
              
              <!-- Prompt Input -->
              <div class="card">
                <h3 class="text-lg font-bold text-gray-800 mb-4">描述需求</h3>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p class="text-sm text-gray-700">
                    ✨ 图片生成模式：描述想要生成的图片内容
                  </p>
                </div>
                <textarea
                  v-model="prompt"
                  rows="5"
                  placeholder="描述您想要生成的图片，例如：一只可爱的小猫坐在彩虹上、未来城市的夜景、油画风格的向日葵...越详细越好"
                  class="input-field resize-none"
                ></textarea>
              </div>
              
              <GenerateButton
                :disabled="!canGenerate"
                :disabled-reason="disabledReason"
                @generate="handleGenerate"
              />
            </div>
            
            <!-- Right Column: Result -->
            <div>
              <ResultDisplay @regenerate="handleGenerate" />
            </div>
          </div>
          
          <!-- Mobile/Tablet Layout: Stacked -->
          <div class="lg:hidden space-y-6">
            <ImageUploader />
            <div class="card">
              <ModelSelector />
            </div>
            <div class="card">
              <AspectRatioSelector />
            </div>
            
            <!-- Prompt Input -->
            <div class="card">
              <h3 class="text-lg font-bold text-gray-800 mb-4">描述需求</h3>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p class="text-sm text-gray-700">
                  ✨ 图片生成模式：描述想要生成的图片内容
                </p>
              </div>
              <textarea
                v-model="prompt"
                rows="4"
                placeholder="描述您想要生成的图片，例如：一只可爱的小猫坐在彩虹上..."
                class="input-field resize-none"
              ></textarea>
            </div>
            
            <GenerateButton
              :disabled="!canGenerate"
              :disabled-reason="disabledReason"
              @generate="handleGenerate"
            />
            
            <ResultDisplay @regenerate="handleGenerate" />
          </div>
        </div>
      </section>
      
      <!-- Stats Section -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2">10万+</div>
              <div class="text-gray-600">用户信赖</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2">100万+</div>
              <div class="text-gray-600">图片处理</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2">99%</div>
              <div class="text-gray-600">好评率</div>
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
      return this.isAuthenticated && this.prompt.trim().length > 0 && !this.isGenerating;
    },
    disabledReason() {
      if (!this.isAuthenticated) {
        return '请先登录';
      }
      if (!this.prompt.trim()) {
        return '请输入图片描述';
      }
      return '请填写完整信息';
    }
  },
  methods: {
    async handleGenerate() {
      if (!this.canGenerate) return;
      
      this.$store.dispatch('generation/setGenerating', true);
      
      try {
        const response = await generateImage({
          prompt: this.config.prompt,
          model: this.config.model,
          aspectRatio: this.config.aspectRatio,
          inputImages: this.config.inputImages
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

