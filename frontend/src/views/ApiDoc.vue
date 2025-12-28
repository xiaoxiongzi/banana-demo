<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <main class="flex-1 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">API 调用文档</h1>
          <p class="text-lg text-gray-600">通过 API 集成 Nano Banana AI 到您的应用中</p>
        </div>
        
        <!-- Introduction -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">简介</h2>
          <p class="text-gray-700 mb-4">
            Nano Banana AI 提供了完整的 RESTful API，您可以将我们的 AI 图像生成能力集成到您的应用、网站或服务中。
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-sm text-gray-700">
              💡 提示：使用 API 需要获取 API Token，请先登录后在个人中心获取。
            </p>
          </div>
        </div>
        
        <!-- Authentication -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">认证</h2>
          <p class="text-gray-700 mb-4">所有 API 请求需要在请求头中包含认证令牌：</p>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
            <pre><code>Authorization: Bearer YOUR_API_TOKEN</code></pre>
          </div>
        </div>
        
        <!-- Base URL -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Base URL</h2>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
            <pre><code>https://api.banana.147ai.com/api</code></pre>
          </div>
        </div>
        
        <!-- Generate Image Endpoint -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">生成图片</h2>
          <div class="mb-4">
            <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">
              POST
            </span>
            <span class="ml-2 font-mono text-gray-700">/generate</span>
          </div>
          
          <h3 class="font-semibold text-gray-900 mb-2">请求参数：</h3>
          <div class="overflow-x-auto mb-4">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left">参数</th>
                  <th class="px-4 py-2 text-left">类型</th>
                  <th class="px-4 py-2 text-left">必填</th>
                  <th class="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr>
                  <td class="px-4 py-2 font-mono">prompt</td>
                  <td class="px-4 py-2">string</td>
                  <td class="px-4 py-2">是</td>
                  <td class="px-4 py-2">图片描述</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">model</td>
                  <td class="px-4 py-2">string</td>
                  <td class="px-4 py-2">是</td>
                  <td class="px-4 py-2">模型：banana, banana-pro, banana-pro-stable</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">aspectRatio</td>
                  <td class="px-4 py-2">string</td>
                  <td class="px-4 py-2">是</td>
                  <td class="px-4 py-2">尺寸比例：1:1, 16:9 等</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-mono">inputImages</td>
                  <td class="px-4 py-2">array</td>
                  <td class="px-4 py-2">否</td>
                  <td class="px-4 py-2">输入图片 URL 数组（最多3张）</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 class="font-semibold text-gray-900 mb-2">请求示例：</h3>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto mb-4">
            <pre><code>{
  "prompt": "一只可爱的小猫坐在彩虹上",
  "model": "banana",
  "aspectRatio": "1:1",
  "inputImages": []
}</code></pre>
          </div>
          
          <h3 class="font-semibold text-gray-900 mb-2">响应示例：</h3>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
            <pre><code>{
  "success": true,
  "message": "图片生成成功",
  "data": {
    "imageUrl": "https://...",
    "creditsUsed": 10,
    "remainingCredits": 90,
    "historyId": "..."
  }
}</code></pre>
          </div>
        </div>
        
        <!-- Code Examples -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">代码示例</h2>
          
          <h3 class="font-semibold text-gray-900 mb-2">JavaScript (Axios)</h3>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto mb-4">
            <pre><code>const axios = require('axios');

const response = await axios.post(
  'https://api.banana.147ai.com/api/generate',
  {
    prompt: '一只可爱的小猫坐在彩虹上',
    model: 'banana',
    aspectRatio: '1:1'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);</code></pre>
          </div>
          
          <h3 class="font-semibold text-gray-900 mb-2">Python (Requests)</h3>
          <div class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
            <pre><code>import requests

response = requests.post(
    'https://api.banana.147ai.com/api/generate',
    json={
        'prompt': '一只可爱的小猫坐在彩虹上',
        'model': 'banana',
        'aspectRatio': '1:1'
    },
    headers={
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Content-Type': 'application/json'
    }
)

print(response.json())</code></pre>
          </div>
        </div>
        
        <!-- Rate Limits -->
        <div class="card mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">速率限制</h2>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-primary mr-2">•</span>
              <span>基础套餐：每分钟最多 10 次请求</span>
            </li>
            <li class="flex items-start">
              <span class="text-primary mr-2">•</span>
              <span>专业套餐：每分钟最多 30 次请求</span>
            </li>
            <li class="flex items-start">
              <span class="text-primary mr-2">•</span>
              <span>高级套餐：每分钟最多 60 次请求</span>
            </li>
            <li class="flex items-start">
              <span class="text-primary mr-2">•</span>
              <span>企业套餐：无限制</span>
            </li>
          </ul>
        </div>
        
        <!-- Support -->
        <div class="card bg-primary-50 border border-primary-200">
          <h3 class="font-semibold text-gray-900 mb-2">需要帮助？</h3>
          <p class="text-gray-700 mb-4">
            如果您在使用 API 时遇到问题，请联系我们的技术支持团队。
          </p>
          <router-link
            to="/contact"
            class="inline-block bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition"
          >
            联系技术支持
          </router-link>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'ApiDoc',
  components: {
    Header,
    Footer
  }
};
</script>

