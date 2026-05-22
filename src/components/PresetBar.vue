<template>
    <div class="preset_section">
        <div class="preset_header">
            <template v-if="presets.length">
                <span class="preset_title">预设列表</span>
                <el-button v-if="!manageMode" size="small" text class="manage_btn" @click="manageMode = true">
                    <el-icon style="font-size:14px"><Setting /></el-icon> 管理
                </el-button>
                <template v-else>
                    <span class="manage_mode_hint">已进入管理模式</span>
                    <el-button size="small" text type="primary" class="manage_btn done_btn" @click="manageMode = false">
                        <el-icon style="font-size:14px"><CircleCheck /></el-icon> 完成
                    </el-button>
                </template>
            </template>
        </div>
        <div class="preset_tags" v-if="presets.length">
            <div
                v-for="item in presets"
                :key="item.id"
                class="preset_tag_wrapper"
                :class="{
                    'is_dragging': dragItem && dragItem.id === item.id,
                    'is_drag_over': dragOverId === item.id,
                    'manage_mode': manageMode
                }"
                :draggable="manageMode"
                @dragstart="onDragStart($event, item)"
                @dragover.prevent="onDragOver($event, item)"
                @dragleave="onDragLeave(item)"
                @drop.prevent="onDrop(item)"
                @dragend="onDragEnd"
            >
                <el-tag
                    :type="activePresetId === item.id ? '' : 'info'"
                    :effect="activePresetId === item.id ? 'dark' : 'plain'"
                    size="large"
                    :disable-transitions="false"
                    class="preset_tag"
                    :class="{ 'preset_tag-active': activePresetId === item.id }"
                    @click="onTagClick(item)"
                >
                    {{ item.name }}
                </el-tag>
                <span v-if="manageMode" class="tag_actions">
                    <el-button size="small" text class="tag_action_btn" @click.stop="openEdit(item)">
                        <el-icon style="font-size:13px"><Edit /></el-icon>
                    </el-button>
                    <el-button size="small" text class="tag_action_btn delete_btn" @click.stop="$emit('deletePreset', item)">
                        <el-icon style="font-size:13px"><Delete /></el-icon>
                    </el-button>
                </span>
            </div>
        </div>

        <!-- Edit Dialog -->
        <Teleport to="body">
            <el-dialog
                v-if="editVisible"
                :model-value="true"
                title="编辑预设"
                width="560px"
                :close-on-click-modal="false"
                @close="editVisible = false"
            >
                <el-form label-position="top">
                    <el-form-item label="预设名称">
                        <el-input v-model="editName" placeholder="输入预设名称" />
                    </el-form-item>
                    <el-form-item label="链接列表（每行一个）">
                        <el-input
                            v-model="editMetaData"
                            type="textarea"
                            :autosize="{ minRows: 5, maxRows: 16 }"
                            placeholder="https://example.com"
                        />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="editVisible = false">取消</el-button>
                    <el-button type="primary" :disabled="!editName.trim()" @click="confirmEdit">保存</el-button>
                </template>
            </el-dialog>
        </Teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Setting, CircleCheck, Edit, Delete } from '@element-plus/icons-vue'

const props = defineProps({
    presets: { type: Array, required: true },
    activePresetId: { type: String, default: '' }
})

const emit = defineEmits(['applyPreset', 'deletePreset', 'updatePresetContent', 'reorderPresets'])

const manageMode = ref(false)

// ---- drag reorder ----
const dragItem = ref(null)
const dragOverId = ref(null)

const onDragStart = (e, item) => {
    dragItem.value = item
    e.dataTransfer.effectAllowed = 'move'
}

const onDragOver = (e, item) => {
    if (dragItem.value && dragItem.value.id !== item.id) {
        dragOverId.value = item.id
    }
}

const onDragLeave = (item) => {
    if (dragOverId.value === item.id) {
        dragOverId.value = null
    }
}

const onDrop = (item) => {
    if (!dragItem.value || dragItem.value.id === item.id) return
    const arr = [...props.presets]
    const srcIdx = arr.findIndex(p => p.id === dragItem.value.id)
    const dstIdx = arr.findIndex(p => p.id === item.id)
    if (srcIdx === -1 || dstIdx === -1) return
    const [moved] = arr.splice(srcIdx, 1)
    arr.splice(dstIdx, 0, moved)
    emit('reorderPresets', arr)
    dragOverId.value = null
    dragItem.value = null
}

const onDragEnd = () => {
    dragItem.value = null
    dragOverId.value = null
}

// ---- edit ----
const editVisible = ref(false)
const editingItem = ref(null)
const editName = ref('')
const editMetaData = ref('')

const openEdit = (item) => {
    editingItem.value = item
    editName.value = item.name
    editMetaData.value = item.snapshot.metaData || ''
    editVisible.value = true
}

const confirmEdit = () => {
    if (!editName.value.trim()) return
    const snapshot = { ...editingItem.value.snapshot, metaData: editMetaData.value }
    emit('updatePresetContent', editingItem.value.id, editName.value, snapshot)
    editVisible.value = false
    editingItem.value = null
    editName.value = ''
    editMetaData.value = ''
}

// ---- click ----
const onTagClick = (item) => {
    if (manageMode.value) return
    emit('applyPreset', item)
}
</script>

<style lang='scss' scoped>
.preset_section {
    margin-bottom: 12px;
}

.preset_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.preset_title {
    font-size: 13px;
    color: var(--g-body-text-color);
    opacity: 0.7;
}

.manage_mode_hint {
    font-size: 12px;
    color: var(--el-color-primary);
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

.preset_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.preset_tag_wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: border-color 0.2s, background-color 0.2s, opacity 0.2s, box-shadow 0.2s;
    cursor: default;

    &.manage_mode {
        cursor: grab;
        .preset_tag {
            padding-right: 40px;
        }
    }

    &.is_dragging {
        opacity: 0.4;
        border-style: dashed;
    }

    &.is_drag_over {
        border-color: var(--el-color-primary);
        background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
        box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
    }
}

.preset_tag {
    cursor: pointer;
    min-width: 90px;
    display: inline-flex;
    align-items: center;

    :deep(.el-tag__content) {
        flex: 1;
        text-align: center;
        font-size: 14px;
        font-weight: 900;
    }
}

.preset_tag-active {
    --el-tag-bg-color: var(--el-color-primary);
    --el-tag-text-color: #fff;
    --el-tag-border-color: var(--el-color-primary);
}

.tag_action_btn {
    padding: 1px;
    min-height: auto;
    color: var(--el-color-primary);

    &:hover {
        background-color: rgba(64, 158, 255, 0.1) !important;
    }

    &.delete_btn {
        color: var(--el-color-danger);
        &:hover {
            background-color: rgba(245, 108, 108, 0.1) !important;
        }
    }
}

.tag_actions {
    position: absolute;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 0;
    z-index: 1;

    .el-button+.el-button {
        margin-left: 4px;
    }
}
</style>