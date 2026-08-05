<template>
    <div class="simple_page">
        <div class="simple_card">
            <el-input
                v-model="metaData"
                :autosize="{ minRows: 10, maxRows: 36 }"
                type="textarea"
                placeholder="Please input links"
                :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                class="input"
            />
            <div class="simple_actions">
                <el-button type="primary" size="large" :disabled="!hasLinks" @click="openAll">打开</el-button>
                <el-button size="large" :disabled="!hasLinks" @click="clear">清空</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onKeyStroke } from '@vueuse/core'
import { coreState } from '../store/coreState'

const { metaData, hasLinks, clear } = coreState.links
const { openAll } = coreState.openLink

// 打开次数/延迟沿用核心页配置（coreState.openLink 的 numData / openDelay 等）
onKeyStroke('Enter', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (hasLinks.value) {
            openAll()
        }
    }
})
</script>

<style lang='scss' scoped>
.simple_page {
    display: flex;
    justify-content: center;
}
.simple_card {
    width: 100%;
    box-sizing: border-box;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    padding: 12px;
}
.input {
    margin-bottom: 16px;
}
.simple_actions {
    display: flex;
    gap: 10px;
}
</style>
