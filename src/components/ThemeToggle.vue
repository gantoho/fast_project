<template>
    <div class="main-top">
        <div class="main-text">
            <h1>快速批量打开网站</h1>
            <p>一行只能存在一个需要打开的链接</p>
        </div>
        <ThemePanel />
    </div>
</template>

<script setup>
import ThemePanel from './ThemePanel.vue'
</script>

<style lang='scss' scoped>
.main-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main-text {
        h1{
            margin-bottom: 10px;
            color: var(--el-color-primary);
        }
        p{
            margin-bottom: 10px;
        }
    }
}
@media (max-width: 640px) {
    .main-top {
        align-items: flex-start;
    }
    .main-text {
        h1 {
            font-size: 18px;
        }
        p {
            font-size: 12px;
        }
    }
}
</style>