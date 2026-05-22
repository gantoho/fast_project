<template>
    <div class="btn_box">
        <el-button type="primary" :disabled="!hasLinks" @click="$emit('openLink')">
            {{ isStepOpen ? `打开下一批 (${stepBatchSize}个，共${stepBatchSize * numData}次)` : `全部打开 (共${linkListLen * numData}次)` }}
            <span class="shortcut-hint">Ctrl+Enter</span>
        </el-button>
        <el-button type="danger" :icon="Delete" circle title="清空" @click="handleClear" />
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
    linkListLen: { type: Number, default: 0 }
})

const emit = defineEmits(['openLink', 'clear'])

const handleClear = async () => {
    try {
        await ElMessageBox.confirm('确定要清空所有链接吗？此操作不可恢复。', '清空确认', {
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
}
.shortcut-hint {
    margin-left: 6px;
    font-size: 11px;
    opacity: 0.6;
    font-style: normal;
}
</style>