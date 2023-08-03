<template>
  <div class="main">
    <h1>快速批量打开网站</h1>
    <p>一行只能存在一个需要打开的链接</p>
    <Home/>
    <Footer/>
  </div>
</template>

<script setup>
import Home from './pages/Home.vue'
import Footer from './components/Footer.vue'

</script>

<style lang='scss' scoped>
.main{
  width: 100%;
  max-width: 900px;

  h1{
    margin-bottom: 10px;
    color: #6c7bff;
  }

  p{
    margin-bottom: 10px;
  }
}
</style>