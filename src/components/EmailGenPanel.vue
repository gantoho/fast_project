<template>
    <div class="email_gen_module">
        <div class="email_gen_header">
            <span class="email_gen_label">邮箱生成器</span>
            <el-switch
                :model-value="emailSwitch"
                @update:model-value="$emit('update:emailSwitch', $event)"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
            />
        </div>
        <template v-if="emailSwitch">
            <div class="email_gen_mode">
                <span class="email_gen_label">生成模式</span>
                <el-radio-group :model-value="emailMode" @change="$emit('update:emailMode', $event)" class="email_gen_mode_group">
                    <el-radio-button label="range">数字范围</el-radio-button>
                    <el-radio-button label="time">当前时间</el-radio-button>
                    <el-radio-button label="timestamp">时间戳</el-radio-button>
                    <el-radio-button label="sha1">SHA-1哈希</el-radio-button>
                    <el-radio-button label="english">纯英文</el-radio-button>
                </el-radio-group>
            </div>
            <div class="email_gen_form">
                <div class="email_gen_row">
                    <div class="email_gen_group">
                        <span class="email_gen_label">用户名前缀</span>
                        <el-input
                            :model-value="emailPrefix"
                            @update:model-value="$emit('update:emailPrefix', $event)"
                            placeholder="例如：testbit"
                            size="small"
                            class="email_gen_input"
                        />
                    </div>
                    <template v-if="emailMode === 'range'">
                        <div class="email_gen_group">
                            <span class="email_gen_label">数字范围</span>
                            <el-input-number
                                :model-value="emailStart"
                                @update:model-value="$emit('update:emailStart', $event)"
                                :min="1"
                                :max="99999"
                                size="small"
                                controls-position="right"
                                class="email_gen_input_num"
                            />
                            <span class="email_gen_sep">-</span>
                            <el-input-number
                                :model-value="emailEnd"
                                @update:model-value="$emit('update:emailEnd', $event)"
                                :min="1"
                                :max="99999"
                                size="small"
                                controls-position="right"
                                class="email_gen_input_num"
                            />
                            <span class="email_gen_sep">步长</span>
                            <el-input-number
                                :model-value="emailStep"
                                @update:model-value="$emit('update:emailStep', $event)"
                                :min="1"
                                :max="100"
                                size="small"
                                controls-position="right"
                                class="email_gen_input_num"
                            />
                        </div>
                    </template>
                    <template v-else>
                        <div class="email_gen_group">
                            <span class="email_gen_label">生成数量</span>
                            <el-input-number
                                :model-value="emailCount"
                                @update:model-value="$emit('update:emailCount', $event)"
                                :min="1"
                                :max="100"
                                size="small"
                                controls-position="right"
                                class="email_gen_input_num"
                            />
                            <span class="email_gen_sep">个</span>
                        </div>
                    </template>
                </div>
                <div class="email_gen_row">
                    <div class="email_gen_group" v-if="emailMode === 'range'">
                        <span class="email_gen_label">补零位数</span>
                        <el-input-number
                            :model-value="emailZeroPad"
                            @update:model-value="$emit('update:emailZeroPad', $event)"
                            :min="0"
                            :max="10"
                            size="small"
                            controls-position="right"
                            class="email_gen_input_num"
                        />
                        <span class="email_gen_hint">0=不补零，3=001,002...</span>
                    </div>
                    <div class="email_gen_group" v-if="emailMode === 'sha1'">
                        <span class="email_gen_label">哈希长度</span>
                        <el-select
                            :model-value="sha1Length"
                            @change="$emit('update:sha1Length', $event)"
                            size="small"
                            class="email_gen_select"
                        >
                            <el-option :label="8" :value="8" />
                            <el-option :label="16" :value="16" />
                            <el-option :label="24" :value="24" />
                            <el-option :label="32" :value="32" />
                            <el-option :label="40" :value="40" />
                        </el-select>
                        <span class="email_gen_hint">完整SHA-1为40位</span>
                    </div>
                    <div class="email_gen_group" v-if="emailMode === 'english'">
                        <span class="email_gen_label">英文长度</span>
                        <el-input-number
                            :model-value="englishLength"
                            @update:model-value="$emit('update:englishLength', $event)"
                            :min="1"
                            :max="50"
                            size="small"
                            controls-position="right"
                            class="email_gen_input_num"
                        />
                        <span class="email_gen_label">大小写</span>
                        <el-select
                            :model-value="emailCase"
                            @update:model-value="$emit('update:emailCase', $event)"
                            size="small"
                            class="email_gen_select"
                        >
                            <el-option label="混合" value="mixed" />
                            <el-option label="纯大写" value="upper" />
                            <el-option label="纯小写" value="lower" />
                        </el-select>
                    </div>
                    <div class="email_gen_group">
                        <span class="email_gen_label">邮箱后缀</span>
                        <el-select
                            :model-value="emailSuffix"
                            @update:model-value="$emit('update:emailSuffix', $event)"
                            size="small"
                            class="email_gen_select"
                        >
                            <el-option v-for="item in emailSuffixOptions" :key="item.id" :label="item.label" :value="item.value" />
                            <el-option label="自定义" value="__custom__" />
                        </el-select>
                        <el-input
                            v-if="emailSuffix === '__custom__'"
                            v-model="customSuffix"
                            placeholder="输入后缀如 @company.com"
                            size="small"
                            class="email_gen_input_custom"
                            @blur="handleCustomSuffix"
                        />
                    </div>
                </div>
                <div class="email_gen_generate_row" v-if="emailMode !== 'range'">
                    <el-button type="primary" size="default" @click="$emit('generate')">
                        <el-icon :size="14"><Refresh /></el-icon> 生成邮箱
                    </el-button>
                </div>
            </div>
            <div class="email_gen_result" v-if="emailList.length">
                <div class="email_gen_result_header">
                    <span>生成 {{ emailList.length }} 个邮箱</span>
                    <div class="email_gen_result_actions">
                        <el-button size="small" text class="email_gen_action_btn" @click="copyEmails">
                            <el-icon :size="13"><DocumentCopy /></el-icon> 复制全部
                        </el-button>
                        <el-button size="small" text type="primary" class="email_gen_action_btn" @click="$emit('insertEmails')">
                            <el-icon :size="13"><Plus /></el-icon> 插入到链接
                        </el-button>
                    </div>
                </div>
                <div class="email_gen_result_list">
                    <div v-for="(email, i) in displayList" :key="i" class="email_gen_result_item" @click="copySingleEmail(email)">
                        <span class="email_gen_result_idx">{{ i + 1 }}</span>
                        <span class="email_gen_result_email">{{ email }}</span>
                        <el-icon class="email_gen_copy_btn" :size="13"><DocumentCopy /></el-icon>
                    </div>
                    <div v-if="emailList.length > 20" class="email_gen_result_more">
                        ... 还有 {{ emailList.length - 20 }} 个邮箱
                    </div>
                </div>
            </div>
            <p v-else class="email_gen_empty">
                <template v-if="emailMode === 'range'">请配置生成规则，邮箱将自动生成</template>
                <template v-else>点击上方「生成邮箱」按钮生成</template>
            </p>
        </template>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DocumentCopy, Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    emailSwitch: { type: Boolean, default: false },
    emailMode: { type: String, default: 'range' },
    emailPrefix: { type: String, default: 'user' },
    emailStart: { type: Number, default: 1 },
    emailEnd: { type: Number, default: 10 },
    emailStep: { type: Number, default: 1 },
    emailZeroPad: { type: Number, default: 0 },
    emailCount: { type: Number, default: 1 },
    emailSuffix: { type: String, default: '@gmail.com' },
    emailSuffixOptions: { type: Array, default: () => [] },
    sha1Length: { type: Number, default: 40 },
    englishLength: { type: Number, default: 10 },
    emailCase: { type: String, default: 'mixed' },
    emailList: { type: Array, default: () => [] }
})

const emit = defineEmits([
    'update:emailSwitch',
    'update:emailMode',
    'update:emailPrefix',
    'update:emailStart',
    'update:emailEnd',
    'update:emailStep',
    'update:emailZeroPad',
    'update:emailCount',
    'update:emailSuffix',
    'update:sha1Length',
    'update:englishLength',
    'update:emailCase',
    'generate',
    'insertEmails'
])

const customSuffix = ref('')

const displayList = computed(() => props.emailList.slice(0, 20))

const handleCustomSuffix = () => {
    if (customSuffix.value.trim()) {
        emit('update:emailSuffix', customSuffix.value.trim())
    }
}

const copyEmails = async () => {
    try {
        await navigator.clipboard.writeText(props.emailList.join('\n'))
        ElMessage({ message: '复制成功', type: 'success' })
    } catch {
        const textarea = document.createElement('textarea')
        textarea.value = props.emailList.join('\n')
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        ElMessage({ message: '复制成功', type: 'success' })
    }
}

const copySingleEmail = async (email) => {
    try {
        await navigator.clipboard.writeText(email)
        ElMessage({ message: `已复制: ${email}`, type: 'success' })
    } catch {
        const textarea = document.createElement('textarea')
        textarea.value = email
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        ElMessage({ message: `已复制: ${email}`, type: 'success' })
    }
}
</script>

<style lang='scss' scoped>
.email_gen_module {
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}

.email_gen_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.email_gen_label {
    font-size: 15px;
    font-weight: 600;
    color: var(--g-body-text-color);
}

.email_gen_mode {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    margin-top: 16px;
}

.email_gen_mode_group {
    display: flex;
}

.email_gen_form {
    margin-bottom: 16px;
}

.email_gen_row {
    display: flex;
    gap: 24px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.email_gen_generate_row {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}

.email_gen_group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.email_gen_input {
    width: 140px;
}

.email_gen_input_num {
    width: 80px;
}

.email_gen_sep {
    color: var(--g-body-text-color);
    font-size: 14px;
}

.email_gen_hint {
    font-size: 12px;
    color: var(--g-body-text-color-secondary, rgba(0,0,0,0.5));
}

.email_gen_select {
    width: 100px;
}

.email_gen_input_custom {
    width: 160px;
}

.email_gen_result {
    background: rgba(0, 0, 0, 0.03);
    background: color-mix(in srgb, var(--el-color-primary) 5%, transparent);
    border-radius: 6px;
    padding: 12px;
}
html.dark .email_gen_result {
    background: rgba(255, 255, 255, 0.05);
}

.email_gen_result_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 13px;
    color: var(--g-body-text-color);
}

.email_gen_result_actions {
    display: flex;
    gap: 8px;
}

.email_gen_action_btn {
    padding: 2px 8px;
}

.email_gen_result_list {
    max-height: 200px;
    overflow-y: auto;
}

.email_gen_result_item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    font-size: 13px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background: var(--el-color-primary);
    }
}

.email_gen_result_idx {
    width: 24px;
    font-size: 12px;
    color: var(--g-body-text-color-secondary, rgba(0,0,0,0.5));
    text-align: right;
}

.email_gen_result_email {
    color: var(--g-body-text-color);
    word-break: break-all;
}

.email_gen_copy_btn {
    margin-left: auto;
    margin-right: 8px;
    cursor: pointer;
    color: var(--g-body-text-color-secondary);
    transition: color 0.15s;
    flex-shrink: 0;
    &:hover {
        color: var(--el-color-primary);
    }
}

.email_gen_result_more {
    text-align: center;
    padding: 8px 0;
    font-size: 12px;
    color: var(--g-body-text-color-secondary, rgba(0,0,0,0.5));
}

.email_gen_empty {
    font-size: 13px;
    color: var(--g-body-text-color-secondary, rgba(0,0,0,0.5));
    text-align: center;
    padding: 16px 0;
}
</style>