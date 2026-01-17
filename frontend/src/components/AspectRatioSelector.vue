<template>
  <div class="aspect-ratio-selector">
    <h3 class="font-bold text-slate-800 mb-3">图片尺寸</h3>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="ratio in ratios"
        :key="ratio.value"
        @click="selectRatio(ratio.value)"
        :class="[
          'flex flex-col items-center justify-center p-2 rounded-lg border transition-all h-16',
          selectedRatio === ratio.value
            ? 'border-banana-500 bg-banana-50 text-banana-700'
            : 'border-slate-200 text-slate-500 hover:border-banana-300'
        ]"
      >
        <div :class="['border-2 border-current rounded-sm mb-1', ratio.icon]"></div>
        <span class="text-[10px] font-bold">{{ ratio.value }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AspectRatioSelector',
  data() {
    return {
      ratios: [
        { value: '1:1', icon: 'w-4 h-4' },
        { value: '2:3', icon: 'w-4 h-6' },
        { value: '3:2', icon: 'w-6 h-4' },
        { value: '9:16', icon: 'w-3 h-6' },
        { value: '16:9', icon: 'w-6 h-3' },
        { value: '21:9', icon: 'w-8 h-3' }
      ]
    };
  },
  computed: {
    ...mapGetters('generation', ['config']),
    selectedRatio() {
      return this.config.aspectRatio;
    }
  },
  methods: {
    selectRatio(ratio) {
      this.$store.dispatch('generation/updateAspectRatio', ratio);
    }
  }
};
</script>

