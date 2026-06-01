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
                <div class="bookmarklet_mode_switch">
                    <el-button
                        size="small"
                        :type="mode === 'url' ? 'primary' : 'default'"
                        @click="mode = 'url'"
                    >URL 参数模式</el-button>
                    <el-button
                        size="small"
                        :type="mode === 'custom' ? 'primary' : 'default'"
                        @click="mode = 'custom'"
                    >自定义配置模式</el-button>
                    <el-button
                        size="small"
                        :type="mode === 'file' ? 'primary' : 'default'"
                        @click="mode = 'file'"
                    >本地文件模式</el-button>
                    <el-button
                        size="small"
                        :type="mode === 'remote' ? 'primary' : 'default'"
                        @click="mode = 'remote'"
                    >远程 URL 模式</el-button>
                </div>

                <template v-if="mode === 'url'">
                    <p class="bookmarklet_desc">
                        从浏览器地址栏的 URL 参数中读取并填入目标网站对应的输入框。适用于分享链接时携带参数的场景。
                    </p>
                </template>

                <template v-if="mode === 'custom'">
                    <p class="bookmarklet_desc">
                        在代码中直接配置固定的参数键值对，书签始终填入相同的参数。适用于固定参数重复使用的场景。
                    </p>
                    <div class="bookmarklet_config_area">
                        <div class="bookmarklet_config_header">
                            <span>配置参数（JSON 格式）</span>
                            <div class="bookmarklet_config_actions">
                                <span v-if="!jsonValid && customParamsRaw.trim()" class="json_invalid">JSON 格式错误</span>
                                <span v-else-if="customParamsRaw.trim() && jsonValid" class="json_valid">JSON 有效</span>
                                <el-button size="small" text class="tool_btn" @click="triggerJsonImport">
                                    <el-icon :size="13"><Upload /></el-icon> 导入 JSON
                                </el-button>
                                <input ref="jsonFileInput" type="file" accept=".json" style="display:none" @change="handleJsonImport" />
                            </div>
                        </div>
                        <el-input
                            v-model="customParamsRaw"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 10 }"
                            placeholder='{"username": "admin", "lang": "zh"}'
                            :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)', fontFamily: 'monospace', fontSize: '13px'}"
                            class="bookmarklet_json_input"
                        />
                        <p class="bookmarklet_config_hint">每对键值对应一个输入框，按 <code>name</code> → <code>id</code> → <code>placeholder</code> → <code>aria-label</code> → <code>type</code> → label 文本 智能匹配。key 以 <code>placeholder:</code> 开头则按 placeholder 值匹配；以 <code>sel:</code> 开头则直接作为 CSS 选择器。</p>
                    </div>
                </template>

                <template v-if="mode === 'file'">
                    <p class="bookmarklet_desc">
                        点击书签后弹出文件选择器，选中本地的 JSON 配置文件，自动读取并填入目标网站对应的输入框。适用于配置频繁变化或不同网站需要不同配置的场景。
                    </p>
                </template>

                <template v-if="mode === 'remote'">
                    <p class="bookmarklet_desc">
                        配置 API 服务的地址，每次点击书签先调用 <code>/api/generate</code> 生成最新数据，再填入输入框。
                    </p>
                    <div class="bookmarklet_config_area">
                        <div class="bookmarklet_config_header">
                            <span>API 服务地址</span>
                            <span v-if="remoteHost.trim() && remotePort.trim()" class="remote_status" :class="remoteStatus">
                                <template v-if="remoteStatus === 'idle'">待检测</template>
                                <template v-else-if="remoteStatus === 'checking'">检测中...</template>
                                <template v-else-if="remoteStatus === 'valid'">连接正常</template>
                                <template v-else-if="remoteStatus === 'invalid'">连接失败</template>
                                <el-button size="small" text class="remote_check_btn" @click="checkRemoteHealth" :disabled="remoteStatus === 'checking' || !remoteHost.trim() || !remotePort.trim()">
                                    <el-icon :size="12"><Refresh /></el-icon> 检测
                                </el-button>
                            </span>
                        </div>
                        <div class="remote_host_port">
                            <span class="remote_prefix">http://</span>
                            <el-input
                                v-model="remoteHost"
                                placeholder="localhost"
                                :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                            />
                            <span class="remote_colon">:</span>
                            <el-input
                                v-model="remotePort"
                                placeholder="8080"
                                class="remote_port_input"
                                :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                            />
                        </div>
                        <p class="bookmarklet_config_hint">填入服务地址后自动检测连接状态。书签代码会调用 <code>http://{host}:{port}/api/generate</code> 获取最新数据。接口路径 <code>/api/latest</code> 和 <code>/api/generate</code> 已内置于生成代码中。</p>
                    </div>
                </template>

                <div class="bookmarklet_code_box">
                    <div class="bookmarklet_code_header">
                        <span>书签代码（点击复制）</span>
                        <div class="bookmarklet_code_actions">
                            <el-button size="small" text class="copy_all_btn" @click="copyBookmarklet">
                                <el-icon :size="13"><DocumentCopy /></el-icon> 复制书签代码
                            </el-button>
                            <el-button size="small" text class="copy_all_btn" @click="copyConsoleCode">
                                <el-icon :size="13"><DocumentCopy /></el-icon> 复制 Console 代码
                            </el-button>
                        </div>
                    </div>
                    <div class="bookmarklet_code" @click="copyBookmarklet" :title="copied ? '已复制书签代码！' : '点击复制书签代码'">
                        <code>javascript:{{ jsCode || '// 请填写有效的 JSON 配置' }}</code>
                    </div>
                    <p class="bookmarklet_console_hint">
                        <el-icon :size="12"><InfoFilled /></el-icon>
                        访客模式或无书签栏？复制「Console 代码」，在目标页面按 <kbd>F12</kbd> → 控制台(Console) → 粘贴代码 → <kbd>Enter</kbd>
                    </p>
                </div>

                <div v-if="mode === 'url'" class="bookmarklet_how">
                    <span class="bookmarklet_how_title">使用方法：</span>
                    <ol class="bookmarklet_steps">
                        <li>点击上方「复制书签代码」按钮</li>
                        <li>在浏览器书签栏右键 → <strong>添加网页</strong>，名称填「自动填参」，网址粘贴刚复制的内容</li>
                        <li>打开带参数的目标网站（如 <code>example.com?q=hello&name=world</code>），点击该书签</li>
                        <li>参数自动填入匹配的输入框</li>
                    </ol>
                    <p class="bookmarklet_alt_tip">📌 无法添加书签（如访客模式）？复制「Console 代码」，在目标页面按 <kbd>F12</kbd> → 控制台 → 粘贴 → <kbd>Enter</kbd></p>
                </div>
                <div v-if="mode === 'custom'" class="bookmarklet_how">
                    <span class="bookmarklet_how_title">使用方法：</span>
                    <ol class="bookmarklet_steps">
                        <li>在上方输入框中直接编写 JSON，或点击「导入 JSON」从文件导入</li>
                        <li>点击上方「复制书签代码」按钮，添加到浏览器书签</li>
                        <li>打开目标网站，点击该书签，参数自动填入匹配的输入框</li>
                    </ol>
                    <p class="bookmarklet_alt_tip">📌 无法添加书签（如访客模式）？复制「Console 代码」，在目标页面按 <kbd>F12</kbd> → 控制台 → 粘贴 → <kbd>Enter</kbd></p>
                </div>
                <div v-if="mode === 'file'" class="bookmarklet_how">
                    <span class="bookmarklet_how_title">使用方法：</span>
                    <ol class="bookmarklet_steps">
                        <li>准备好 JSON 配置文件，格式如 <code>{"username": "admin", "lang": "zh"}</code></li>
                        <li>点击上方「复制书签代码」按钮，添加到浏览器书签</li>
                        <li>打开目标网站，点击该书签，在弹出的文件选择器中选中你的 JSON 文件</li>
                        <li>参数自动填入匹配的输入框</li>
                    </ol>
                    <p class="bookmarklet_alt_tip">📌 无法添加书签（如访客模式）？复制「Console 代码」，在目标页面按 <kbd>F12</kbd> → 控制台 → 粘贴 → <kbd>Enter</kbd></p>
                </div>
                <div v-if="mode === 'remote'" class="bookmarklet_how">
                    <span class="bookmarklet_how_title">使用方法：</span>
                    <ol class="bookmarklet_steps">
                        <li>在上方输入框中填入 API 服务的 <strong>Host</strong> 和 <strong>Port</strong></li>
                        <li>系统自动调用 <code>/api/latest</code> 检测连接状态</li>
                        <li>点击上方「复制书签代码」按钮，添加到浏览器书签</li>
                        <li>打开目标网站，点击该书签，自动调用 <code>http://{host}:{port}/api/generate</code> 获取数据并填入输入框</li>
                        <li>每次点击都会重新请求 <code>/api/generate</code>，获取最新数据</li>
                    </ol>
                    <p class="bookmarklet_alt_tip">📌 无法添加书签（如访客模式）？复制「Console 代码」，在目标页面按 <kbd>F12</kbd> → 控制台 → 粘贴 → <kbd>Enter</kbd></p>
                </div>

                <div class="bookmarklet_tip">
                    <el-icon :size="14"><InfoFilled /></el-icon>
                    <span>匹配规则：按 <code>name</code> → <code>id</code> → <code>placeholder</code> → <code>aria-label</code> → <code>type</code> → label 文本 智能查找输入框。高级用法：key 以 <code>placeholder:</code> 开头则按 placeholder 值匹配，如 <code>placeholder:用户名</code>；以 <code>sel:</code> 开头时直接作为 CSS 选择器，如 <code>sel:[placeholder="用户名"]</code>。</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { View, DocumentCopy, Link, InfoFilled, Upload, Refresh } from '@element-plus/icons-vue'
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

const { jsCode, mode, customParamsRaw, jsonValid, remoteHost, remotePort, remoteStatus, checkRemoteHealth } = useBookmarklet()
const bookmarkletVisible = ref(false)
const copied = ref(false)
const copiedConsole = ref(false)
const jsonFileInput = ref(null)

const triggerJsonImport = () => {
    jsonFileInput.value?.click()
}

const handleJsonImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
        const text = ev.target?.result
        if (typeof text === 'string') {
            customParamsRaw.value = text
        }
    }
    reader.readAsText(file)
    e.target.value = ''
}

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
        await navigator.clipboard.writeText('javascript:' + jsCode.value)
        copied.value = true
        ElMessage({ message: '已复制书签代码，请添加到浏览器书签', type: 'success' })
        setTimeout(() => { copied.value = false }, 2000)
    } catch {
        ElMessage({ message: '复制失败，请手动复制', type: 'error' })
    }
}

const copyConsoleCode = async () => {
    try {
        await navigator.clipboard.writeText(jsCode.value)
        copiedConsole.value = true
        ElMessage({ message: '已复制代码，在浏览器按 F12 打开控制台粘贴即可运行', type: 'success' })
        setTimeout(() => { copiedConsole.value = false }, 2000)
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
.bookmarklet_mode_switch {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    :deep(.el-button) {
        margin-left: 0 !important;
    }
    :deep(.el-button:not(.el-button--primary)) {
        background: transparent !important;
        border-color: var(--el-color-primary) !important;
        color: var(--g-body-text-color) !important;
        opacity: 0.6;
        transition: opacity 0.2s, background 0.2s !important;
    }
    :deep(.el-button:not(.el-button--primary):hover) {
        opacity: 1;
        background: color-mix(in srgb, var(--el-color-primary) 8%, transparent) !important;
    }
}
.bookmarklet_desc {
    margin: 0 0 14px;
    font-size: 13px;
    opacity: 0.8;
}
.bookmarklet_config_area {
    margin-bottom: 14px;
}
.bookmarklet_config_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 12px;
    opacity: 0.7;
}
.bookmarklet_config_actions {
    display: flex;
    align-items: center;
    gap: 6px;
}
.bookmarklet_config_actions .tool_btn {
    font-size: 12px;
}
.json_valid {
    color: var(--el-color-primary);
    opacity: 0.8;
    font-weight: 500;
}
.json_invalid {
    color: var(--el-color-danger);
    opacity: 0.8;
    font-weight: 500;
}
.bookmarklet_config_hint {
    margin: 6px 0 0;
    font-size: 12px;
    opacity: 0.55;
    line-height: 1.5;
}
.bookmarklet_config_hint code {
    padding: 0 4px;
    background-color: rgba(0,0,0,0.06);
    border-radius: 3px;
    font-size: 11px;
}
.remote_host_port {
    display: flex;
    align-items: center;
    gap: 4px;
}
.remote_prefix {
    font-size: 13px;
    opacity: 0.6;
    font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    white-space: nowrap;
}
.remote_colon {
    font-size: 13px;
    opacity: 0.6;
    font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
}
.remote_host_port .el-input {
    flex: 1;
}
.remote_port_input {
    max-width: 100px;
}
.remote_status {
    font-size: 12px;
    font-weight: 500;
}
.remote_status.idle {
    color: var(--g-body-text-color);
    opacity: 0.5;
}
.remote_status.checking {
    color: var(--el-color-warning);
}
.remote_status.valid {
    color: var(--el-color-success);
}
.remote_status.invalid {
    color: var(--el-color-danger);
}
.remote_check_btn {
    font-size: 12px;
    margin-left: 4px;
    opacity: 0.7;
}
.remote_check_btn:hover {
    opacity: 1;
}
.remote_check_btn .el-icon {
    margin-right: 1px;
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
.bookmarklet_code_actions {
    display: flex;
    gap: 6px;
}
.bookmarklet_code_actions .copy_all_btn {
    font-size: 12px;
    white-space: nowrap;
}
.bookmarklet_console_hint {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    font-size: 11px;
    opacity: 0.55;
    line-height: 1.4;
}
.bookmarklet_console_hint kbd {
    padding: 1px 4px;
    background-color: rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    font-size: 10px;
    font-family: inherit;
}
.bookmarklet_alt_tip {
    margin-top: 8px;
    padding: 6px 10px;
    background-color: color-mix(in srgb, var(--el-color-primary) 6%, transparent);
    border-radius: 4px;
    font-size: 12px;
    opacity: 0.75;
    line-height: 1.5;
}
.bookmarklet_alt_tip kbd {
    padding: 1px 4px;
    background-color: rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 3px;
    font-size: 11px;
    font-family: inherit;
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

@media (max-width: 640px) {
    .bookmarklet_body {
        font-size: 13px;
    }
    .bookmarklet_mode_switch {
        flex-wrap: wrap;
        gap: 6px;
        :deep(.el-button) {
            flex: 1 1 calc(50% - 3px);
            padding: 5px 8px;
            font-size: 12px;
        }
    }
    .bookmarklet_desc {
        font-size: 12px;
    }
    .bookmarklet_config_header {
        flex-wrap: wrap;
        gap: 4px;
    }
    .bookmarklet_config_actions {
        flex-wrap: wrap;
    }
    .bookmarklet_config_actions .el-button {
        font-size: 11px;
        padding: 3px 6px;
    }
    .bookmarklet_config_hint {
        font-size: 11px;
    }
    .bookmarklet_how {
        padding: 10px 12px;
    }
    .bookmarklet_how_title {
        font-size: 12px;
    }
    .bookmarklet_steps {
        font-size: 12px;
        padding-left: 18px;
    }
    .bookmarklet_code {
        padding: 10px 12px;
    }
    .bookmarklet_code code {
        font-size: 11px;
    }
    .bookmarklet_tip {
        font-size: 11px;
        padding: 8px 10px;
    }
}
</style>