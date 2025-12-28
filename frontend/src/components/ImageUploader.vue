<template>
  <div class="image-uploader card">
    <h3 class="text-lg font-bold text-gray-800 mb-4">选择图片（可选）</h3>
    
    <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
      <p class="text-sm text-gray-700">
        💡 可以上传图片进行编辑，或直接输入提示词生成新图片
      </p>
    </div>
    
    <div class="upload-area border-2 border-dashed border-gray-300 rounded-xl py-16 px-8 text-center hover:border-primary transition cursor-pointer">
      <div class="flex flex-col items-center">
        <span class="text-4xl mb-3">🎨</span>
        <h4 class="font-semibold text-gray-600 mb-2">上传图片进行编辑（可选）</h4>
        <p class="text-sm text-gray-500 mb-4">支持 JPG、PNG、WEBP 格式，最多3张图片</p>
        
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <button
          @click="$refs.fileInput.click()"
          class="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition"
          :disabled="uploading || images.length >= 3"
        >
          {{ uploading ? '上传中...' : '选择图片' }}
        </button>
        
        <p class="text-xs text-gray-400 mt-2">或直接在下方输入提示词</p>
      </div>
    </div>
    
    <!-- 已上传图片预览 -->
    <div v-if="images.length > 0" class="mt-4 grid grid-cols-3 gap-3">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative group"
      >
        <img :src="image" alt="上传的图片" class="w-full h-24 object-cover rounded-lg" />
        <button
          @click="removeImage(index)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uploadImages } from '@/api/upload';

export default {
  name: 'ImageUploader',
  data() {
    return {
      uploading: false
    };
  },
  computed: {
    ...mapGetters('generation', ['config']),
    images() {
      return this.config.inputImages;
    }
  },
  methods: {
    async handleFileSelect(event) {
      const files = Array.from(event.target.files);
      
      if (files.length === 0) return;
      
      // 检查数量限制
      if (this.images.length + files.length > 3) {
        this.$store.dispatch('ui/showWarning', '最多只能上传3张图片');
        return;
      }
      
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = files.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        this.$store.dispatch('ui/showError', '图片大小不能超过5MB');
        return;
      }
      
      this.uploading = true;
      
      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('images', file);
        });
        
        const response = await uploadImages(formData);
        
        if (response.success) {
          const newImages = [...this.images, ...response.data.files];
          this.$store.dispatch('generation/updateInputImages', newImages);
          this.$store.dispatch('ui/showSuccess', '图片上传成功');
        }
      } catch (error) {
        this.$store.dispatch('ui/showError', error.message || '图片上传失败');
      } finally {
        this.uploading = false;
        event.target.value = '';
      }
    },
    removeImage(index) {
      this.$store.dispatch('generation/removeInputImage', index);
    }
  }
};
</script>

