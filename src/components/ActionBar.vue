<template>
    <div class="btn_box">
        <div class="btn_left">
            <el-button type="primary" :disabled="!hasLinks" @click="$emit('openLink')">
                {{ isStepOpen ? `打开下一批 (${stepBatchSize}个，共${stepBatchSize * numData}次)` : `全部打开 (共${linkListLen * numData}次)` }}
                <span class="shortcut-hint">Ctrl+Enter</span>
            </el-button>
            <el-popover v-if="processedUrlList.length" placement="top" :width="520" trigger="click">
                <template #reference>
                    <el-button :disabled="!hasLinks" text size="small" class="preview_btn">
                        <el-icon :size="14"><View /></el-icon> 预览
                    </el-button>
                </template>
                <div class="preview_box">
                    <div class="preview_header">
                        <span>共 {{ processedUrlList.length }} 个链接</span>
                        <el-button size="small" text type="primary" class="copy_all_btn" @click="copyUrls">
                            <el-icon :size="13"><DocumentCopy /></el-icon> 复制全部
                        </el-button>
                    </div>
                    <div class="preview_list">
                        <div v-for="(url, i) in processedUrlList" :key="i" class="preview_item">
                            <span class="preview_idx">{{ i + 1 }}</span>
                            <span class="preview_url">{{ url }}</span>
                        </div>
                    </div>
                </div>
            </el-popover>
        </div>
        <el-button type="danger" :icon="Delete" circle title="清空" @click="handleClear" />
    </div>
</template>

<script setup>
import { Delete, View, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
    hasLinks: { type: Boolean, default: false },
    isStepOpen: { type: Boolean, default: false },
    stepBatchSize: { type: Number, default: 1 },
    numData: { type: Number, default: 1 },
    linkListLen: { type: Number, default: 0 },
    processedUrlList: { type: Array, default: () => [] }
})

const emit = defineEmits(['openLink', 'clear'])

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

const copyUrls = async () => {
    try {
        await navigator.clipboard.writeText(props.processedUrlList.join('\n'))
        ElMessage({ message: `已复制 ${props.processedUrlList.length} 个链接`, type: 'success' })
    } catch {
        ElMessage({ message: '复制失败，请手动复制', type: 'error' })
    }
}
</script>

<style lang='scss' scoped>
.btn_box{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.btn_left {
    display: flex;
    align-items: center;
    gap: 8px;
}
.shortcut-hint {
    margin-left: 6px;
    font-size: 11px;
    opacity: 0.6;
    font-style: normal;
}
.preview_btn {
    font-size: 12px;
    color: var(--g-body-text-color);
}
.preview_box {
    max-height: 360px;
    display: flex;
    flex-direction: column;
}
.preview_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--g-body-text-color);
    opacity: 0.7;
}
.copy_all_btn {
    opacity: 1;
    font-weight: 600;
}
.copy_all_btn:hover {
    background: rgba(0, 0, 0, 0.04) !important;
    border-radius: 4px !important;
}
.copy_all_btn .el-icon {
    margin-right: 2px;
}
.preview_list {
    overflow-y: auto;
    max-height: 300px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.preview_item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 3px 0;
    font-size: 12px;
    line-height: 1.4;
}
.preview_idx {
    color: var(--g-body-text-color);
    opacity: 0.35;
    min-width: 22px;
    text-align: right;
    flex-shrink: 0;
}
.preview_url {
    color: var(--g-body-text-color);
    word-break: break-all;
    opacity: 0.75;
}
</style>