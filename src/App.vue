<template>
  <div class="main">
    <ThemeToggle />
    <nav class="page_tabs">
      <router-link to="/" class="page_tab" active-class="is-active">简洁模式</router-link>
      <router-link to="/advanced" class="page_tab" active-class="is-active">高级模式</router-link>
      <router-link to="/tools" class="page_tab" active-class="is-active">工具箱</router-link>
    </nav>
    <router-view />
    <Footer @click-footer="handleFooterClick" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Footer from './components/Footer.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useEasterEgg } from './composables/useEasterEgg'
import { toggleForceMonochrome, forceMonochrome } from './composables/useStyle'

const route = useRoute()
const router = useRouter()
const { handleFooterClick } = useEasterEgg()

// 离开页面时记录当前路由
watch(
  () => route.path,
  (path) => { localStorage.setItem('fast_lastRoute', path) }
)

// 启动时恢复到上次离开时的路由
onMounted(() => {
  const saved = localStorage.getItem('fast_lastRoute')
  const validPaths = ['/', '/advanced', '/tools']
  if (saved && saved !== route.path && validPaths.includes(saved)) {
    router.replace(saved)
  }
})

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
.page_tabs {
  display: inline-flex;
  gap: 4px;
  margin-bottom: 20px;
  padding: 4px;
  border: 1px solid var(--g-home-link-border);
  border-radius: 8px;
  background-color: color-mix(in srgb, var(--el-color-primary) 4%, transparent);
}
.page_tab {
  padding: 6px 20px;
  font-size: 13px;
  border-radius: 6px;
  color: var(--g-body-text-color);
  text-decoration: none;
  opacity: 0.65;
  transition: all 0.2s;
  user-select: none;
  &:hover {
    opacity: 1;
  }
  &.is-active {
    background-color: var(--el-color-primary);
    color: #fff;
    opacity: 1;
    font-weight: 600;
  }
}
@media (max-width: 640px) {
  .main {
    padding: 0 12px;
  }
  .page_tabs {
    width: 100%;
    box-sizing: border-box;
  }
  .page_tab {
    flex: 1;
    text-align: center;
    padding: 6px 0;
  }
}
</style>
