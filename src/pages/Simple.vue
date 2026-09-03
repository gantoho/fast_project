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
            <transition name="undo-fade">
                <div v-if="clearedBackup != null" class="undo_bar">
                    <span class="undo_bar_text">
                        <el-icon class="undo_bar_icon"><Warning /></el-icon>
                        <span>已清空链接列表</span>
                    </span>
                    <el-button size="small" round type="primary" plain @click="undoClear">撤销</el-button>
                </div>
            </transition>
            <div class="simple_actions">
                <el-button type="primary" size="large" :disabled="!hasLinks" @click="openAllRaw">打开</el-button>
                <el-button type="large" :icon="Delete" :disabled="!hasLinks" circle title="清空" @click="clear" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onKeyStroke } from '@vueuse/core'
import { coreState } from '../store/coreState'
import { Delete, Warning } from '@element-plus/icons-vue'

const { links, openLink: openLinkState } = coreState
const { metaData, hasLinks, clear, undoClear, clearedBackup } = links
const { openAllRaw } = openLinkState

// 打开次数/延迟沿用核心页配置（coreState.openLink 的 numData / openDelay 等）
onKeyStroke('Enter', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (hasLinks.value) {
            openAllRaw()
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
.undo_bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: -4px 4px 12px;
    padding: 6px 4px 6px 2px;
    font-size: 13px;
    color: var(--g-text-color-secondary, var(--g-body-text-color));
    opacity: 0.92;

    .undo_bar_text {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .undo_bar_icon {
        flex-shrink: 0;
        font-size: 14px;
        color: var(--el-color-warning);
    }
}

.undo-fade-enter-active,
.undo-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}
.undo-fade-enter-from,
.undo-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
.simple_actions {
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
</style>
