import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { fetchConfig, forceMonochrome } from './composables/useStyle'

async function bootstrap() {
  // 先拉取后端配置（失败则回退 localStorage）
  await fetchConfig()

  // 根据最终值初始化 data-style 属性
  if (forceMonochrome.value) {
    document.documentElement.setAttribute('data-style', 'monochrome')
  } else {
    const savedStyle = localStorage.getItem('fast_themeStyle')
    if (!savedStyle || savedStyle === '"default"') {
      document.documentElement.setAttribute('data-style', 'skeuomorphic')
    } else {
      const key = savedStyle.replace(/^"|"$/g, '')
      if (key !== 'default') {
        document.documentElement.setAttribute('data-style', key)
      }
    }
  }

  createApp(App).use(ElementPlus).use(createPinia()).mount('#app')
}

bootstrap()