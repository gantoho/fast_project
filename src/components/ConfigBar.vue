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
            <el-button text size="small" class="tool_btn" @click="bookmarkletVisible = true">
                <el-icon :size="14"><Link /></el-icon> 书签工具
            </el-button>
        </div>
        <el-dialog v-model="bookmarkletVisible" title="书签小工具 (Bookmarklet)" width="640px" append-to-body>
            <div class="bookmarklet_body">
                <p class="bookmarklet_desc">
                    将此代码保存为浏览器书签，在目标网站上点击该书签，即可自动将 URL 中的参数填入对应的输入框。
                </p>
                <div class="bookmarklet_how">
                    <span class="bookmarklet_how_title">使用方法：</span>
                    <ol class="bookmarklet_steps">
                        <li>点击下方「复制代码」按钮</li>
                        <li>在浏览器书签栏右键 → <strong>添加网页</strong></li>
                        <li>名称填「自动填参」，网址粘贴刚复制的内容</li>
                        <li>打开带参数的目标网站（如 <code>example.com?q=hello&name=world</code>）</li>
                        <li>点击该书签，参数自动填入匹配的输入框</li>
                    </ol>
                </div>
                <div class="bookmarklet_code_box">
                    <div class="bookmarklet_code_header">
                        <span>书签代码（点击复制）</span>
                        <el-button size="small" text class="copy_all_btn" @click="copyBookmarklet">
                            <el-icon :size="13"><DocumentCopy /></el-icon> 复制代码
                        </el-button>
                    </div>
                    <div class="bookmarklet_code" @click="copyBookmarklet" :title="copied ? '已复制！' : '点击复制'">
                        <code>javascript:{{ jsCode }}</code>
                    </div>
                </div>
                <div class="bookmarklet_tip">
                    <el-icon :size="14"><InfoFilled /></el-icon>
                    <span>匹配规则：按 <code>name</code> 属性 → <code>id</code> 属性 查找输入框，支持 input、textarea、select 元素。如果目标网站使用 Vue/React 等框架，也能正常触发更新。</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { View, DocumentCopy, Link, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useBookmarklet } from '../composables/useBookmarklet'

defineProps({
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

const { jsCode } = useBookmarklet()
const bookmarkletVisible = ref(false)
const copied = ref(false)

const copyUrls = async () => {
    try {
        await navigator.clipboard.writeText(props.processedUrlList.join('\n'))
        ElMessage({ message: `已复制 ${props.processedUrlList.length} 个链接`, type: 'success' })
    } catch {
        ElMessage({ message: '复制失败，请手动复制', type: 'error' })
    }
}

const copyBookmarklet = async () => {
    try {
        await navigator.clipboard.writeText('javascript:' + jsCode)
        copied.value = true
        ElMessage({ message: '已复制书签代码，请添加到浏览器书签', type: 'success' })
        setTimeout(() => { copied.value = false }, 2000)
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
.bookmarklet_body {
    font-size: 14px;
    line-height: 1.6;
}
.bookmarklet_desc {
    margin: 0 0 14px;
    font-size: 13px;
    opacity: 0.8;
}
.bookmarklet_how {
    margin-bottom: 16px;
    padding: 12px 16px;
    background-color: color-mix(in srgb, var(--el-color-primary) 6%, transparent);
    border-radius: 6px;
}
.bookmarklet_how_title {
    font-size: 13px;
    font-weight: 600;
}
.bookmarklet_steps {
    margin: 8px 0 0;
    padding-left: 20px;
    font-size: 13px;
}
.bookmarklet_steps li {
    margin-bottom: 4px;
}
.bookmarklet_steps code {
    padding: 1px 5px;
    background-color: rgba(0,0,0,0.06);
    border-radius: 3px;
    font-size: 12px;
}
.bookmarklet_code_box {
    margin-bottom: 14px;
}
.bookmarklet_code_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    opacity: 0.7;
}
.bookmarklet_code {
    padding: 12px 14px;
    background-color: #1e1e1e;
    border-radius: 6px;
    cursor: pointer;
    overflow-x: auto;
    transition: opacity 0.15s;
}
.bookmarklet_code:hover {
    opacity: 0.85;
}
.bookmarklet_code code {
    font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #d4d4d4;
    word-break: break-all;
    white-space: pre-wrap;
}
.bookmarklet_tip {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 10px 14px;
    background-color: color-mix(in srgb, #e6a23c 10%, transparent);
    border-radius: 6px;
    font-size: 12px;
    opacity: 0.85;
}
.bookmarklet_tip .el-icon {
    margin-top: 2px;
    flex-shrink: 0;
    color: #e6a23c;
}
.bookmarklet_tip code {
    padding: 0 4px;
    background-color: rgba(0,0,0,0.06);
    border-radius: 3px;
    font-size: 11px;
}
:global(.preview-popover) {
    max-width: calc(100vw - 24px) !important;
}
</style>