<template>
    <div class="btn_box">
        <el-button type="primary" :disabled="!hasLinks" @click="$emit('openLink')">
            {{ isStepOpen ? `打开下一批 (${stepBatchSize}个，共${stepBatchSize * numData}次)` : `全部打开 (共${linkListLen * numData}次)` }}
        </el-button>
        <el-button type="danger" :icon="Delete" circle title="清空" @click="$emit('clear')" />
    </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue'

defineProps({
    hasLinks: { type: Boolean, default: false },
    isStepOpen: { type: Boolean, default: false },
    stepBatchSize: { type: Number, default: 1 },
    numData: { type: Number, default: 1 },
    linkListLen: { type: Number, default: 0 }
})

defineEmits(['openLink', 'clear'])
</script>

<style lang='scss' scoped>
.btn_box{
    display: flex;
    justify-content: space-between;
}
</style>