<template>
  <div class="model-selector">
    <h3 class="font-bold text-slate-800 mb-3">AI 模型选择</h3>
    <div class="space-y-3">
      <button
        v-for="model in models"
        :key="model.id"
        @click="selectModel(model.id)"
        :class="[
          'w-full p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all relative overflow-hidden',
          model.id !== 'banana'
            ? (selectedModel === model.id
                ? 'border-orange-500 bg-gradient-to-r from-banana-500 to-orange-500 text-white shadow-md'
                : 'border-slate-200 text-slate-600 hover:border-banana-300')
            : (selectedModel === model.id
                ? 'border-banana-500 bg-banana-50 text-banana-700'
                : 'border-slate-200 text-slate-600 hover:border-banana-300')
        ]"
      >
        <div class="flex items-center gap-2 z-10">
          <span class="text-lg">{{ model.icon }}</span>
          <span>{{ model.name }}</span>
          <span
            v-if="model.badge"
            :class="[
              'text-[10px] px-1.5 py-0.5 rounded font-normal backdrop-blur-sm',
              selectedModel === model.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            ]"
          >
            {{ model.badge }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModelSelector',
  data() {
    return {
      models: [
        {
          id: 'banana',
          name: 'Banana',
          icon: '⚡',
          badge: '',
          credits: 10,
          description: '快速生成，效果优秀'
        },
        {
          id: 'banana-pro',
          name: 'Banana Pro',
          icon: '✨',
          badge: '增强',
          credits: 20,
          description: '增强版模型，细节更丰富'
        },
        {
          id: 'banana-pro-stable',
          name: 'Banana Pro',
          icon: '🛡️',
          badge: '稳定',
          credits: 25,
          description: '稳定性更高，适合专业场景'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('generation', ['config']),
    selectedModel() {
      return this.config.model;
    }
  },
  methods: {
    selectModel(modelId) {
      this.$store.dispatch('generation/updateModel', modelId);
    }
  }
};
</script>

