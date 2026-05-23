import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 初始化风格 data-style 属性
const savedStyle = localStorage.getItem('fast_themeStyle')
if (savedStyle && savedStyle !== '"default"') {
  const key = savedStyle.replace(/^"|"$/g, '')
  if (key !== 'default') {
    document.documentElement.setAttribute('data-style', key)
  }
}

const app = createApp(App).use(ElementPlus).use(createPinia()).mount('#app')
