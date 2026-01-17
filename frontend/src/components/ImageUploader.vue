<template>
  <div class="bg-white rounded-2xl p-5 border border-banana-100 shadow-sm flex flex-col">
    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
      选择图片 <span class="text-xs font-normal text-slate-400">(可选)</span>
    </h3>
    
    <div class="bg-banana-50/50 border border-banana-200 rounded-lg p-3 text-xs text-banana-800 mb-4 flex items-start gap-2">
      ✨ 上传图片可进行“图生图”参考，不上传则为“文生图”
    </div>
    
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <div class="grid grid-cols-2 gap-3 mb-3">
      <button
        v-for="slot in slots"
        :key="slot.index"
        @click="handleSlotClick(slot.index)"
        class="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-banana-400 hover:bg-banana-50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-banana-500 group overflow-hidden"
      >
        <template v-if="slot.image">
          <img :src="slot.image.data" alt="Upload" class="w-full h-full object-cover" />
          <div
            @click.stop="removeImage(slot.index)"
            class="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </div>
        </template>
        <template v-else>
          <span class="text-2xl mb-1 opacity-50 group-hover:opacity-100 transition-opacity">➕</span>
          <span class="text-[10px] font-bold">添加图片</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ImageUploader',
  data() {
    return {
      uploading: false,
      activeSlotIndex: null,
      slotImages: Array(4).fill(null)
    };
  },
  computed: {
    ...mapGetters('generation', ['config']),
    images() {
      return this.config.inputImages;
    },
    slots() {
      return this.slotImages.map((image, index) => ({
        index,
        image
      }));
    }
  },
  watch: {
    images: {
      handler(newImages) {
        const normalized = Array(4).fill(null);
        (newImages || []).slice(0, 4).forEach((image, index) => {
          normalized[index] = image;
        });
        this.slotImages = normalized;
      },
      immediate: true
    }
  },
  methods: {
    handleSlotClick(index) {
      this.activeSlotIndex = index;
      this.$refs.fileInput.click();
    },
    async handleFileSelect(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$store.dispatch('ui/showError', '图片大小不能超过5MB');
        event.target.value = '';
        return;
      }
      
      if (this.activeSlotIndex === null) {
        event.target.value = '';
        return;
      }
      
      this.uploading = true;
      
      try {
        const imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              data: e.target.result,
              mimeType: file.type,
              name: file.name
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        const nextSlots = [...this.slotImages];
        nextSlots[this.activeSlotIndex] = imageData;
        this.slotImages = nextSlots;
        
        const filteredImages = nextSlots.filter(Boolean);
        this.$store.dispatch('generation/updateInputImages', filteredImages);
        this.$store.dispatch('ui/showSuccess', '图片加载成功');
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '图片加载失败');
      } finally {
        this.uploading = false;
        event.target.value = '';
      }
    },
    removeImage(index) {
      const nextSlots = [...this.slotImages];
      nextSlots[index] = null;
      this.slotImages = nextSlots;
      this.$store.dispatch('generation/updateInputImages', nextSlots.filter(Boolean));
    }
  }
};
</script>

