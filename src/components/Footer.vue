<template>
    <div class="footer">
        <span class="footer_text">快速批量打开网站 &mdash;</span>
        <a href="https://github.com/gantoho/fast_project" target="_blank" class="footer_link">GitHub</a>
    </div>
</template>

<style lang='scss' scoped>
.footer{
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}
.footer_text {
    font-style: normal;
    font-size: 11px;
    color: var(--g-body-text-color);
    opacity: 0.25;
}
.footer_link {
    font-style: normal;
    font-size: 11px;
    color: var(--g-body-text-color);
    opacity: 0.25;
    text-decoration: none;
    transition: opacity 0.2s;
}
.footer_link:hover {
    opacity: 0.5;
}
</style>
