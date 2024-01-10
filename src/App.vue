<template>
  <div class="main">
    <div class="main-top">
      <div class="main-text">
        <h1>快速批量打开网站</h1>
        <p>一行只能存在一个需要打开的链接</p>
      </div>
      <!-- 主题切换按钮 -->
      <div class="theme-switch" @click="themeBtn">
        <el-icon v-if="darkStore.darkMode === 'light'" :size="30"><Sunny /></el-icon>
        <el-icon v-else :size="30"><Moon /></el-icon>
      </div>
    </div>
    <Home/>
    <Footer/>
  </div>
</template>

<script setup>
import Home from './pages/Home.vue'
import Footer from './components/Footer.vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import useDarkStore from './store/darkStore'

const darkStore = useDarkStore()
const themeBtn = ($event) => {
  darkStore.toggleTheme($event)
}
</script>

<style lang='scss' scoped>
.main{
  width: 100%;
  max-width: 900px;

  .main-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main-text {
      h1{
        margin-bottom: 10px;
        color: #6c7bff;
      }
    
      p{
        margin-bottom: 10px;
      }
    }
  }
  .theme-switch {
    cursor: pointer;
  }
}
</style>
