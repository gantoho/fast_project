<template>
    <div class="footer">
        <p>快速批量打开网站 All Rights Reserved.</p>
        <p>欢迎star：<a href="https://github.com/gantoho/fast_project" target="_blank" >Github</a></p>
    </div>
</template>

<script setup>

</script>

<style lang='scss' scoped>
.footer{
    margin-top: 40px;
    font-size: 14px;
    background-color: #454545;
    padding: 10px 5px;
    border-radius: 10px;

    p{
        a{
            color: #6c7bff;
        }
    }

    p + p{
        margin-top: 5px;
    }
}
</style>
