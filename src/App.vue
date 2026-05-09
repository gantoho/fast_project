<template>
  <div class="main">
    <ThemeToggle />
    <Home />
    <Footer />
  </div>
</template>

<script setup>
import Home from './pages/Home.vue'
import Footer from './components/Footer.vue'
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<style lang='scss' scoped>
.main{
  width: 100%;
  max-width: 900px;
}
</style>
