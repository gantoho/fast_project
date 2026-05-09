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
            <div class="sub_path_selector">
                <el-select
                    :model-value="subPath"
                    @update:model-value="$emit('update:subPath', $event)"
                    placeholder="选择已有路径"
                    clearable
                    class="sub_path_select"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <span class="sub_path_or">或</span>
                <el-input
                    :model-value="subPath"
                    @update:model-value="$emit('update:subPath', $event)"
                    class="sub_path_input"
                    :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                    placeholder="手动输入子路径"
                />
            </div>
            <div class="sub_path_custom">
                <div class="sub_path_custom_header">
                    <span class="sub_path_custom_title">管理自定义路径</span>
                </div>
                <div class="sub_path_custom_add">
                    <el-input
                        v-model="customPathInput"
                        class="sub_path_custom_input"
                        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
                        placeholder="输入自定义路径，按 Enter 或点击添加"
                        @keyup.enter="addCustomPath"
                    />
                    <el-button type="primary" size="default" @click="addCustomPath" :disabled="!customPathInput.trim()">添加</el-button>
                </div>
                <div class="sub_path_custom_tags" v-if="options.length">
                    <el-tag
                        v-for="item in options"
                        :key="item.id"
                        closable
                        :disable-transitions="false"
                        @close="$emit('removeCustomPath', item.id)"
                        class="sub_path_tag"
                    >
                        {{ item.label }}
                    </el-tag>
                </div>
                <p class="sub_path_custom_empty" v-else>暂无自定义路径，在上方添加</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    subPathSwitch: { type: Boolean, default: false },
    subPath: { type: String, default: '' },
    options: { type: Array, required: true }
})

const emit = defineEmits(['update:subPathSwitch', 'update:subPath', 'addCustomPath', 'removeCustomPath'])

const customPathInput = ref('')

const addCustomPath = () => {
    const val = customPathInput.value.trim()
    if (!val) return
    if (props.options.some(item => item.value === val)) {
        ElMessage({ message: '该路径已存在', type: 'warning' })
        return
    }
    emit('addCustomPath', val)
    customPathInput.value = ''
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
.sub_path_selector {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    .sub_path_select {
        flex: 1;
    }
    .sub_path_or {
        color: var(--g-body-text-color);
        font-size: 13px;
        white-space: nowrap;
        opacity: 0.6;
    }
    .sub_path_input {
        flex: 1;
    }
}
.sub_path_custom {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--g-home-link-border);
}
.sub_path_custom_header {
    margin-bottom: 10px;
    .sub_path_custom_title {
        font-style: normal;
        font-size: 13px;
        opacity: 0.7;
    }
}
.sub_path_custom_add {
    display: flex;
    gap: 10px;
    .sub_path_custom_input {
        flex: 1;
    }
}
.sub_path_custom_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}
.sub_path_tag {
    font-size: 13px;
    --el-tag-bg-color: #ffffff;
    --el-tag-border-color: #d9d9d9;
    --el-tag-text-color: #333;
    --el-tag-close-color: #333;
}
html.dark .sub_path_tag {
    --el-tag-bg-color: #374151;
    --el-tag-border-color: #4b5563;
    --el-tag-text-color: rgba(255, 255, 255, 0.87);
    --el-tag-close-color: rgba(255, 255, 255, 0.87);
}
.sub_path_custom_empty {
    margin-top: 12px;
    font-size: 13px;
    opacity: 0.5;
    font-style: normal;
}
</style>