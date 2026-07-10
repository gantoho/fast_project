<template>
    <div class="btn_box">
        <el-button type="primary" :disabled="!hasLinks" @click="$emit('openLink')">
            <template v-if="downloadMode">
                {{ isStepOpen ? `下载下一批 (${stepBatchSize}个)` : `全部下载 (${linkListLen}个)` }}
            </template>
            <template v-else>
                {{ isStepOpen ? `打开下一批 (${stepBatchSize}个，共${stepBatchSize * numData}次)` : `全部打开 (共${linkListLen * numData}次)` }}
            </template>
            <span class="shortcut-hint">Ctrl+Enter</span>
        </el-button>
        <div class="btn_right">
            <div class="download_mode_switch">
                <span class="download_mode_label">下载模式</span>
                <el-switch
                    :model-value="downloadMode"
                    @update:model-value="$emit('update:downloadMode', $event)"
                    size="small"
                />
            </div>
            <el-button type="danger" :icon="Delete" circle title="清空" @click="handleClear" />
        </div>
    </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
    hasLinks: { type: Boolean, default: false },
    isStepOpen: { type: Boolean, default: false },
    stepBatchSize: { type: Number, default: 1 },
    numData: { type: Number, default: 1 },
    linkListLen: { type: Number, default: 0 },
    downloadMode: { type: Boolean, default: false }
})

const emit = defineEmits(['openLink', 'clear', 'update:downloadMode'])

const handleClear = async () => {
    try {
        await ElMessageBox.confirm('确定要清空所有链接吗？此操作可恢复。', '清空确认', {
            confirmButtonText: '清空',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
        })
        emit('clear')
    } catch { }
}
</script>

<style lang='scss' scoped>
.btn_box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}
.btn_right {
    display: flex;
    align-items: center;
    gap: 10px;
}
.download_mode_switch {
    display: flex;
    align-items: center;
    gap: 6px;
}
.download_mode_label {
    font-size: 12px;
    color: var(--g-body-text-color-secondary);
    white-space: nowrap;
}
.shortcut-hint {
    margin-left: 6px;
    font-size: 11px;
    opacity: 0.6;
    font-style: normal;
}
@media (max-width: 640px) {
    .shortcut-hint {
        display: none;
    }
    .download_mode_label {
        display: none;
    }
}
</style>