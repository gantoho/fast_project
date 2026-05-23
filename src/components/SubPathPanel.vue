<template>
    <div class="sub_path_module">
        <div class="sub_path_header">
            <span class="sub_path_label">子路径</span>
            <el-switch
                :model-value="subPathSwitch"
                @update:model-value="$emit('update:subPathSwitch', $event)"
                inline-prompt
                style="--el-switch-on-color: var(--el-color-primary); --el-switch-off-color: #c9c9c9"
                active-text="启用"
                inactive-text="禁用"
            />
        </div>
        <template v-if="subPathSwitch">
            <el-input
                :model-value="subPath"
                @update:model-value="$emit('update:subPath', $event)"
                class="sub_path_input"
                :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                placeholder="输入子路径（或点击下方选项选择）"
            />
            <div class="sub_path_custom">
                <div class="sub_path_custom_header">
                    <span class="sub_path_custom_title">管理自定义路径</span>
                    <el-button v-if="!manageMode" size="small" text class="manage_btn" @click="manageMode = true">
                        <el-icon style="font-size:14px"><Setting /></el-icon> 管理
                    </el-button>
                    <template v-else>
                        <span class="manage_mode_hint">已进入管理模式</span>
                        <div class="manage_actions">
                            <el-button size="small" text class="manage_btn io_btn" @click="exportPaths">
                                <el-icon style="font-size:13px"><Download /></el-icon> 导出
                            </el-button>
                            <el-button size="small" text class="manage_btn io_btn" @click="triggerImport">
                                <el-icon style="font-size:13px"><Upload /></el-icon> 导入
                            </el-button>
                            <input ref="importInput" type="file" accept=".json" style="display:none" @change="handleImportPaths" />
                            <el-button size="small" text type="primary" class="manage_btn done_btn" @click="exitManageMode">
                                <el-icon style="font-size:14px"><CircleCheck /></el-icon> 完成
                            </el-button>
                        </div>
                    </template>
                </div>
                <div class="sub_path_list" v-if="options.length">
                    <div
                        v-for="(item, index) in options"
                        :key="item.id"
                        class="sub_path_item"
                        :class="{
                            'is-dragging': dragIndex === index,
                            'is-drag-over': dragOverIndex === index,
                            'is-active': subPath === item.value,
                            'is-manage-mode': manageMode
                        }"
                        :draggable="manageMode"
                        @dragstart="onDragStart(index, $event)"
                        @dragover.prevent="onDragOver(index)"
                        @dragleave="onDragLeave(index)"
                        @drop.prevent="onDrop(index)"
                        @dragend="onDragEnd"
                    >
                        <el-icon v-if="manageMode" class="drag-handle"><Rank /></el-icon>
                        <span class="sub_path_item_label" :title="item.label + ' (' + item.value + ')'" @click="!manageMode && emit('update:subPath', item.value)">{{ item.label }}</span>
                        <template v-if="manageMode">
                            <el-icon class="action-trigger manage-action" @click="openEditDialog(item)"><Edit /></el-icon>
                            <el-icon class="action-trigger manage-action delete-action" @click="handleDelete(item.id)"><Delete /></el-icon>
                        </template>
                    </div>
                </div>
                <p class="sub_path_custom_empty" v-else>暂无自定义路径，在下方添加</p>
                <div class="sub_path_custom_add" v-if="manageMode">
                    <el-input
                        v-model="labelInput"
                        class="sub_path_custom_input"
                        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                        placeholder="输入显示名称（可选，默认使用路径）"
                        @keyup.enter="addCustomPath"
                    />
                    <el-input
                        v-model="valueInput"
                        class="sub_path_custom_input"
                        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                        placeholder="输入实际路径"
                        @keyup.enter="addCustomPath"
                    />
                    <el-button type="primary" size="default" @click="addCustomPath" :disabled="!valueInput.trim()">添加</el-button>
                </div>
            </div>

            <!-- Query 选择区域 -->
            <div class="query_section">
                <div class="query_section_header">
                    <span class="query_label">Query</span>
                    <el-button v-if="!queryManageMode" size="small" text class="manage_btn" @click="queryManageMode = true">
                        <el-icon style="font-size:14px"><Setting /></el-icon> 管理
                    </el-button>
                    <template v-else>
                        <span class="manage_mode_hint">已进入管理模式</span>
                        <el-button size="small" text type="primary" class="manage_btn done_btn" @click="queryManageMode = false">
                            <el-icon style="font-size:14px"><CircleCheck /></el-icon> 完成
                        </el-button>
                    </template>
                </div>
                <div class="query_list" v-if="queryOptions.length">
                    <div
                        v-for="(item, index) in queryOptions"
                        :key="item.id"
                        class="query_item"
                        :class="{
                            'is-active': selectedQueryIds.includes(item.id),
                            'is-manage-mode': queryManageMode
                        }"
                    >
                        <span class="query_item_text" :title="item.label + ' (' + item.value + ')'" @click="!queryManageMode && emit('toggleQuery', item.id)">{{ item.label }}</span>
                        <template v-if="queryManageMode">
                            <el-icon class="action-trigger manage-action" @click="openQueryEditDialog(item)"><Edit /></el-icon>
                            <el-icon class="action-trigger manage-action delete-action" @click="handleQueryDelete(item.id)"><Delete /></el-icon>
                        </template>
                    </div>
                </div>
                <p class="sub_path_custom_empty" v-else-if="queryManageMode">暂无 query 参数，在下方添加</p>
                <div class="query_add_row" v-if="queryManageMode">
                    <el-input
                        v-model="queryLabelInput"
                        class="query_label_input"
                        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                        placeholder="名称（可选）"
                        @keyup.enter="addQuery"
                    />
                    <el-input
                        v-model="queryValueInput"
                        class="query_value_input"
                        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                        placeholder="参数值，如 ?d=22"
                        @keyup.enter="addQuery"
                    />
                    <el-button type="primary" size="default" @click="addQuery" :disabled="!queryValueInput.trim()">添加</el-button>
                </div>
            </div>

            <el-dialog v-model="dialogVisible" title="编辑路径" width="400px" append-to-body>
                <div class="dialog_fields">
                    <div class="dialog_field">
                        <label class="dialog_label">名称</label>
                        <el-input v-model="dialogLabel" placeholder="输入显示名称（可选，默认使用路径）" />
                    </div>
                    <div class="dialog_field">
                        <label class="dialog_label">路径</label>
                        <el-input v-model="dialogValue" placeholder="输入实际路径" />
                    </div>
                </div>
                <template #footer>
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveEditDialog" :disabled="!dialogValue.trim()">保存</el-button>
                </template>
            </el-dialog>

            <el-dialog v-model="queryDialogVisible" title="编辑 Query" width="400px" append-to-body>
                <div class="dialog_fields">
                    <div class="dialog_field">
                        <label class="dialog_label">名称</label>
                        <el-input v-model="queryDialogLabel" placeholder="输入显示名称（可选，默认使用参数值）" />
                    </div>
                    <div class="dialog_field">
                        <label class="dialog_label">参数</label>
                        <el-input v-model="queryDialogValue" placeholder="如 ?d=22" />
                    </div>
                </div>
                <template #footer>
                    <el-button @click="queryDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveQueryEditDialog" :disabled="!queryDialogValue.trim()">保存</el-button>
                </template>
            </el-dialog>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Setting, CircleCheck, Rank, Download, Upload } from '@element-plus/icons-vue'

const props = defineProps({
    subPathSwitch: { type: Boolean, default: false },
    subPath: { type: String, default: '' },
    queryOptions: { type: Array, default: () => [] },
    selectedQueryIds: { type: Array, default: () => [] },
    options: { type: Array, required: true }
})

const emit = defineEmits([
    'update:subPathSwitch',
    'update:subPath',
    'addCustomPath',
    'removeCustomPath',
    'updateCustomPath',
    'reorderPaths',
    'addQueryOption',
    'removeQueryOption',
    'updateQueryOption',
    'reorderQueryOptions',
    'toggleQuery'
])

const manageMode = ref(false)

const exitManageMode = () => {
    manageMode.value = false
    dragIndex.value = null
    dragOverIndex.value = null
}

// ---- query ----
const queryManageMode = ref(false)
const queryLabelInput = ref('')
const queryValueInput = ref('')

const addQuery = () => {
    const value = queryValueInput.value.trim()
    if (!value) return
    if (props.queryOptions.some(item => item.value === value)) {
        ElMessage({ message: '该参数已存在', type: 'warning' })
        return
    }
    const label = queryLabelInput.value.trim() || value
    emit('addQueryOption', label, value)
    queryLabelInput.value = ''
    queryValueInput.value = ''
}

const queryDialogVisible = ref(false)
const queryDialogEditId = ref('')
const queryDialogLabel = ref('')
const queryDialogValue = ref('')

const openQueryEditDialog = (item) => {
    queryDialogEditId.value = item.id
    queryDialogLabel.value = item.label
    queryDialogValue.value = item.value
    queryDialogVisible.value = true
}

const saveQueryEditDialog = () => {
    const value = queryDialogValue.value.trim()
    if (!value) return
    const label = queryDialogLabel.value.trim() || value
    emit('updateQueryOption', queryDialogEditId.value, label, value)
    queryDialogVisible.value = false
    queryDialogEditId.value = ''
    queryDialogLabel.value = ''
    queryDialogValue.value = ''
}

const handleQueryDelete = async (id) => {
    const item = props.queryOptions.find(o => o.id === id)
    if (!item) return
    try {
        await ElMessageBox.confirm(`确定删除 query「${item.label}」？`, '删除参数', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
        })
        emit('removeQueryOption', id)
    } catch { }
}

// ---- import/export ----
const importInput = ref(null)

const triggerImport = () => {
    importInput.value?.click()
}

const exportPaths = () => {
    const data = JSON.stringify(props.options, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fast_custom_paths_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage({ message: '自定义路径已导出', type: 'success' })
}

const handleImportPaths = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (!Array.isArray(data)) {
            ElMessage({ message: '文件格式不正确，需要 JSON 数组', type: 'error' })
            return
        }
        for (const item of data) {
            if (!item.id || !item.label || item.value === undefined) {
                ElMessage({ message: '文件格式不正确，缺少必要字段', type: 'error' })
                return
            }
        }
        await ElMessageBox.confirm(
            `将导入 ${data.length} 个自定义路径，现有路径将被替换。确定继续？`,
            '导入路径',
            { confirmButtonText: '导入', cancelButtonText: '取消', type: 'warning' }
        )
        emit('reorderPaths', data)
        ElMessage({ message: `已导入 ${data.length} 个路径`, type: 'success' })
    } catch (err) {
        if (err !== 'cancel') {
            ElMessage({ message: '文件解析失败，请检查文件格式', type: 'error' })
        }
    }
    e.target.value = ''
}

const labelInput = ref('')
const valueInput = ref('')

const addCustomPath = () => {
    const value = valueInput.value.trim()
    if (!value) return
    if (props.options.some(item => item.value === value)) {
        ElMessage({ message: '该路径已存在', type: 'warning' })
        return
    }
    const label = labelInput.value.trim() || value
    emit('addCustomPath', label, value)
    labelInput.value = ''
    valueInput.value = ''
}

const dialogVisible = ref(false)
const dialogEditId = ref('')
const dialogLabel = ref('')
const dialogValue = ref('')

const openEditDialog = (item) => {
    dialogEditId.value = item.id
    dialogLabel.value = item.label
    dialogValue.value = item.value
    dialogVisible.value = true
}

const saveEditDialog = () => {
    const value = dialogValue.value.trim()
    if (!value) return
    const label = dialogLabel.value.trim() || value
    emit('updateCustomPath', dialogEditId.value, label, value)
    dialogVisible.value = false
    dialogEditId.value = ''
    dialogLabel.value = ''
    dialogValue.value = ''
}

const handleDelete = async (id) => {
    const item = props.options.find(o => o.id === id)
    if (!item) return
    try {
        await ElMessageBox.confirm(`确定删除自定义路径「${item.label}」？`, '删除路径', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
        })
        emit('removeCustomPath', id)
    } catch { }
}

const dragIndex = ref(null)
const dragOverIndex = ref(null)

const onDragStart = (index, event) => {
    dragIndex.value = index
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
}

const onDragOver = (index) => {
    dragOverIndex.value = index
}

const onDragLeave = (index) => {
    if (dragOverIndex.value === index) {
        dragOverIndex.value = null
    }
}

const onDrop = (index) => {
    if (dragIndex.value === null || dragIndex.value === index) {
        dragIndex.value = null
        dragOverIndex.value = null
        return
    }
    const list = [...props.options]
    const [removed] = list.splice(dragIndex.value, 1)
    list.splice(index, 0, removed)
    emit('reorderPaths', list)
    dragIndex.value = null
    dragOverIndex.value = null
}

const onDragEnd = () => {
    dragIndex.value = null
    dragOverIndex.value = null
}
</script>

<style lang='scss' scoped>
.sub_path_module {
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}
.sub_path_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .sub_path_label {
        font-style: normal;
        font-size: 15px;
        font-weight: 600;
    }
}
.sub_path_input {
    margin-top: 14px;
}
.sub_path_custom {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--g-home-link-border);
}
.sub_path_custom_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    .sub_path_custom_title {
        font-style: normal;
        font-size: 13px;
        opacity: 0.7;
    }
    .manage_mode_hint {
        font-size: 12px;
        color: var(--el-color-primary);
        opacity: 0.7;
        font-style: normal;
    }
    .manage_actions {
        display: flex;
        align-items: center;
        gap: 2px;
    }
    .manage_btn {
        font-size: 12px;
        &:hover {
            background-color: rgba(64, 158, 255, 0.1) !important;
            border-color: rgba(64, 158, 255, 0.25) !important;
        }
        &.done_btn:hover {
            background-color: rgba(103, 194, 58, 0.1) !important;
            border-color: rgba(103, 194, 58, 0.25) !important;
        }
        &.io_btn:hover {
            background-color: rgba(230, 162, 60, 0.1) !important;
            border-color: rgba(230, 162, 60, 0.25) !important;
        }
    }
}
.sub_path_custom_add {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    .sub_path_custom_input {
        flex: 1;
    }
}
.query_section {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--g-home-link-border);
}
.query_section_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    .query_label {
        font-style: normal;
        font-size: 13px;
        opacity: 0.7;
    }
    .manage_mode_hint {
        font-size: 12px;
        color: var(--el-color-primary);
        opacity: 0.7;
        font-style: normal;
    }
    .manage_btn {
        font-size: 12px;
        &:hover {
            background-color: rgba(64, 158, 255, 0.1) !important;
            border-color: rgba(64, 158, 255, 0.25) !important;
        }
        &.done_btn:hover {
            background-color: rgba(103, 194, 58, 0.1) !important;
            border-color: rgba(103, 194, 58, 0.25) !important;
        }
    }
}
.query_add_row {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    .query_label_input {
        width: 140px;
        flex-shrink: 0;
    }
    .query_value_input {
        flex: 1;
    }
}
.query_list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.query_item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid var(--g-home-link-border);
    border-radius: 4px;
    transition: all 0.2s;
    user-select: none;
    cursor: default;
    &:hover {
        border-color: var(--el-color-primary);
        .action-trigger {
            opacity: 0.5;
        }
    }
    &.is-active {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
        .query_item_text {
            color: #fff;
            &:hover {
                color: #fff;
            }
        }
        .action-trigger {
            color: rgba(255,255,255,0.7);
            opacity: 1;
        }
        .manage-action {
            color: rgba(255,255,255,0.7);
            &:hover {
                color: #fff;
            }
        }
        .delete-action:hover {
            color: #fff;
        }
    }
    &.is-manage-mode {
        border-color: var(--el-color-primary);
        .query_item_text {
            cursor: default;
            &:hover {
                color: inherit;
            }
        }
    }
    .query_item_text {
        font-size: 12px;
        font-style: normal;
        line-height: 1.4;
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: var(--el-color-primary);
        }
    }
    .action-trigger {
        font-size: 14px;
        cursor: pointer;
        color: var(--g-body-text-color);
        opacity: 0;
        transition: opacity 0.15s;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        &:hover {
            opacity: 1 !important;
        }
    }
    .manage-action {
        opacity: 0.5;
        display: flex;
        align-items: center;
        &:hover {
            opacity: 1 !important;
        }
    }
    .delete-action {
        color: #f56c6c;
        &:hover {
            color: #f56c6c;
        }
    }
}
.sub_path_list {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.sub_path_item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid var(--g-home-link-border);
    border-radius: 4px;
    transition: all 0.2s;
    user-select: none;
    cursor: default;
    &:hover {
        border-color: var(--el-color-primary);
        .action-trigger {
            opacity: 0.5;
        }
    }
    &.is-active {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
        .sub_path_item_label {
            color: #fff;
            &:hover {
                color: #fff;
            }
        }
        .action-trigger {
            color: rgba(255,255,255,0.7);
            opacity: 1;
        }
        .drag-handle {
            color: rgba(255,255,255,0.7);
        }
        .manage-action {
            color: rgba(255,255,255,0.7);
            &:hover {
                color: #fff;
            }
        }
        .delete-action:hover {
            color: #fff;
        }
    }
    &.is-manage-mode {
        border-color: var(--el-color-primary);
        padding: 4px 6px;
        gap: 4px;
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
        .sub_path_item_label {
            max-width: 110px;
            cursor: default;
            &:hover {
                color: inherit;
            }
        }
    }
    &.is-dragging {
        opacity: 0.4;
        border-style: dashed;
    }
    &.is-drag-over {
        border-color: var(--el-color-primary);
        background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
        box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
        .sub_path_item_label {
            color: var(--el-color-primary);
        }
    }
    .sub_path_item_label {
        font-size: 12px;
        font-style: normal;
        line-height: 1.4;
        max-width: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: var(--el-color-primary);
        }
    }
    .drag-handle {
        font-size: 14px;
        color: var(--g-body-text-color);
        opacity: 0.4;
        cursor: grab;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        &:hover {
            opacity: 0.8;
        }
    }
    .action-trigger {
        font-size: 14px;
        cursor: pointer;
        color: var(--g-body-text-color);
        opacity: 0;
        transition: opacity 0.15s;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        &:hover {
            opacity: 1 !important;
        }
    }
    .manage-action {
        opacity: 0.5;
        display: flex;
        align-items: center;
        &:hover {
            opacity: 1 !important;
        }
    }
    .delete-action {
        color: #f56c6c;
        &:hover {
            color: #f56c6c;
        }
    }
}
.sub_path_custom_empty {
    margin-top: 12px;
    font-size: 13px;
    opacity: 0.5;
    font-style: normal;
}
.dialog_fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.dialog_field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    .dialog_label {
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
    }
}
</style>