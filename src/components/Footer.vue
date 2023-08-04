<template>
    <div class="footer">
        <p>Copyright © 2009 - 2023 快速批量打开网站 All Rights Reserved. <a href="http://www.miitbeian.gov.cn/" target="_blank">域ICP备19972023号</a></p>
        <p>欢迎提出建议：<a href="https://gitee.com/fast" target="_blank" >Gitee</a></p>
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