<template>
    <div class="config_bar">
        <div class="config_settings">
            <div class="config_group">
                <span class="config_label">打开次数</span>
                <el-input-number :model-value="numData" @update:model-value="$emit('update:numData', $event)" :min="1" :max="10" size="small" controls-position="right" />
                <span class="config_unit">次</span>
            </div>
            <span class="config_sep"></span>
            <div class="config_group">
                <span class="config_label">打开延迟</span>
                <el-switch :model-value="openDelaySwitch" @update:model-value="$emit('update:openDelaySwitch', $event)" size="small" />
                <template v-if="openDelaySwitch">
                    <el-input-number :model-value="openDelay" @update:model-value="$emit('update:openDelay', $event)" :min="100" :max="30000" :step="100" size="small" controls-position="right" />
                    <template v-if="openDelayRandom">
                        <span class="config_sep_text">~</span>
                        <el-input-number :model-value="openDelayMax" @update:model-value="$emit('update:openDelayMax', $event)" :min="openDelay + 100" :max="30000" :step="100" size="small" controls-position="right" />
                    </template>
                    <span class="config_unit">ms</span>
                    <el-switch :model-value="openDelayRandom" @update:model-value="$emit('update:openDelayRandom', $event)" size="small" active-text="随机" inactive-text="固定" />
                </template>
            </div>
        </div>
        <div class="config_tools">
            <el-popover v-if="processedUrlList.length" placement="top" :width="380" trigger="click" popper-class="preview-popover">
                <template #reference>
                    <el-button :disabled="!hasLinks" text size="small" class="tool_btn">
                        <el-icon :size="14"><View /></el-icon> 预览
                    </el-button>
                </template>
                <div class="preview_box">
                    <div class="preview_header">
                        <span>共 {{ processedUrlList.length }} 个链接</span>
                        <el-button size="small" text class="copy_all_btn" @click="copyUrls">
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
    </div>
</template>

<script setup>
import { View, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    numData: { type: Number, default: 1 },
    openDelaySwitch: { type: Boolean, default: false },
    openDelay: { type: Number, default: 500 },
    openDelayMax: { type: Number, default: 1500 },
    openDelayRandom: { type: Boolean, default: false },
    hasLinks: { type: Boolean, default: false },
    processedUrlList: { type: Array, default: () => [] }
})

defineEmits([
    'update:numData',
    'update:openDelaySwitch',
    'update:openDelay',
    'update:openDelayMax',
    'update:openDelayRandom'
])

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
.config_bar {
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    margin-bottom: 20px;
}
.config_settings {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 14px;
}
.config_group {
    display: flex;
    align-items: center;
    gap: 6px;
}
.config_label {
    font-style: normal;
    font-size: 13px;
    white-space: nowrap;
}
.config_sep {
    width: 1px;
    height: 24px;
    background-color: var(--g-home-link-border);
}
.config_sep_text {
    font-size: 13px;
    color: var(--g-body-text-color);
    opacity: 0.5;
}
.config_unit {
    font-style: normal;
    font-size: 12px;
    color: var(--g-body-text-color);
    opacity: 0.5;
    white-space: nowrap;
}
.config_tools {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-top: 1px solid var(--g-home-link-border);
    .el-button+.el-button {
        margin-left: 0;
    }
}
.tool_btn {
    font-size: 12px;
    color: var(--g-body-text-color);
}
@media (max-width: 640px) {
    .config_settings {
        gap: 8px;
        padding: 8px 10px;
    }
    .config_tools {
        padding: 6px 10px;
        gap: 4px;
    }
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
:global(.preview-popover) {
    max-width: calc(100vw - 24px) !important;
}
</style>
