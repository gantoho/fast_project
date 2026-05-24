<template>
  <div class="main">
    <ThemeToggle />
    <Home />
    <Footer @click-footer="handleFooterClick" />
  </div>
</template>

<script setup>
import Home from './pages/Home.vue'
import Footer from './components/Footer.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useEasterEgg } from './composables/useEasterEgg'

const { handleFooterClick } = useEasterEgg()
</script>

<style lang='scss' scoped>
.main{
  width: 100%;
  max-width: 900px;
}
</style>
