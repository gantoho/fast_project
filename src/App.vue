<template>
  <div class="main">
    <ThemeToggle />
    <Home />
    <Footer @click-footer="handleFooterClick" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import Home from './pages/Home.vue'
import Footer from './components/Footer.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useEasterEgg } from './composables/useEasterEgg'
import { toggleForceMonochrome, forceMonochrome } from './composables/useStyle'

const { handleFooterClick } = useEasterEgg()

const onKeydown = async (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyB') {
    e.preventDefault()
    await toggleForceMonochrome()
    ElMessage({
      message: forceMonochrome.value ? '黑白风格已强制开启' : '已恢复风格选择',
      type: 'info',
      duration: 1500
    })
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style lang='scss' scoped>
.main{
  width: 100%;
  max-width: 900px;
  padding: 0 16px;
  box-sizing: border-box;
}
@media (max-width: 640px) {
  .main {
    padding: 0 12px;
  }
}
</style>