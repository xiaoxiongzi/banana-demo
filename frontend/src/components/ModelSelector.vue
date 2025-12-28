<template>
  <div class="model-selector">
    <h3 class="text-lg font-bold text-gray-800 mb-4">AI 模型选择</h3>
    <div class="space-y-3">
      <button
        v-for="model in models"
        :key="model.id"
        @click="selectModel(model.id)"
        :class="[
          'w-full flex items-center justify-center p-4 rounded-xl border-2 transition duration-200',
          selectedModel === model.id
            ? 'border-primary bg-primary text-white'
            : 'border-gray-200 bg-white hover:border-primary hover:bg-orange-50'
        ]"
      >
        <div class="flex items-center space-x-2">
          <span class="text-lg">{{ model.icon }}</span>
          <span class="font-semibold">{{ model.name }}</span>
          <span v-if="model.badge" class="text-xs px-2 py-0.5 bg-white/20 rounded">{{ model.badge }}</span>
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
          badge: '推荐',
          credits: 10,
          description: '快速生成，效果优秀'
        },
        {
          id: 'banana-pro',
          name: 'Banana Pro',
          icon: '🚀',
          badge: '增强',
          credits: 20,
          description: '增强版模型，细节更丰富'
        },
        {
          id: 'banana-pro-stable',
          name: 'Banana Pro',
          icon: '⚓️',
          badge: '增强，稳定',
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

