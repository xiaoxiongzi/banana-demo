<template>
  <div class="aspect-ratio-selector">
    <h3 class="text-lg font-bold text-gray-800 mb-4">图片尺寸</h3>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="ratio in ratios"
        :key="ratio.value"
        @click="selectRatio(ratio.value)"
        :class="[
          'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition duration-200',
          selectedRatio === ratio.value
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 bg-white hover:border-primary hover:bg-orange-50'
        ]"
      >
        <span class="text-xl mb-1">{{ ratio.icon }}</span>
        <span class="text-xs font-medium">{{ ratio.value }}</span>
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
        { value: '1:1', icon: '□' },
        { value: '2:3', icon: '▯' },
        { value: '3:2', icon: '▭' },
        { value: '3:4', icon: '▯' },
        { value: '4:3', icon: '▭' },
        { value: '4:5', icon: '▯' },
        { value: '5:4', icon: '▭' },
        { value: '9:16', icon: '▯' },
        { value: '16:9', icon: '▭' },
        { value: '21:9', icon: '▬' }
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

