<template>
  <div class="model-selector">
    <div class="space-y-2">
      <button
        v-for="model in models"
        :key="model.id"
        @click="selectModel(model.id)"
        :class="[
          'w-full p-2 rounded-xl border text-left font-semibold text-[13px] transition-all relative overflow-hidden',
          model.id !== 'banana'
            ? (selectedModel === model.id
                ? 'border-orange-500 bg-gradient-to-r from-banana-500 to-orange-500 text-white shadow-md'
                : 'border-slate-200 text-slate-700 hover:border-banana-300')
            : (selectedModel === model.id
                ? 'border-banana-500 bg-banana-50 text-banana-700'
                : 'border-slate-200 text-slate-700 hover:border-banana-300')
        ]"
      >
        <div class="flex items-center justify-between gap-3 z-10">
          <div class="flex items-center gap-2">
            <span class="text-base">{{ model.icon }}</span>
            <span>{{ model.name }}</span>
          <span
            v-if="model.badge"
            :class="[
              'text-xs px-1.5 py-0.5 rounded font-normal backdrop-blur-sm',
              selectedModel === model.id
                ? (model.id === 'banana' ? 'bg-banana-200 text-banana-800' : 'bg-white/20 text-white')
                : 'bg-slate-100 text-slate-500'
            ]"
          >
            {{ model.badge }}
          </span>
        </div>
        <span
          :class="[
            'text-[13px] font-semibold',
            selectedModel === model.id
              ? (model.id === 'banana' ? 'text-banana-700' : 'text-white/80')
              : 'text-slate-400'
          ]"
        >
          {{ model.credits }} 点/次
        </span>
      </div>
      <p
        :class="[
          'mt-0.5 text-[13px] font-normal',
          selectedModel === model.id
            ? (model.id === 'banana' ? 'text-banana-700' : 'text-white/80')
            : 'text-slate-500'
        ]"
      >
        {{ model.description }}
      </p>
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

