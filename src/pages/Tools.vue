<template>
    <div class="tools_page">
        <div class="tools_header">
            <h2 class="tools_title">工具箱</h2>
            <p class="tools_desc">独立辅助工具，可配合首页批量打开流程使用</p>
        </div>

        <!-- 邮箱生成器 -->
        <EmailGenPanel
            :email-mode="emailMode"
            :email-prefix="emailPrefix"
            :email-start="emailStart"
            :email-end="emailEnd"
            :email-step="emailStep"
            :email-zero-pad="emailZeroPad"
            :email-count="emailCount"
            :email-suffix="emailSuffix"
            :email-suffix-options="emailSuffixOptions"
            :sha1-length="sha1Length"
            :english-length="englishLength"
            :email-case="emailCase"
            :email-list="emailList"
            @update:email-mode="emailMode = $event"
            @update:email-prefix="emailPrefix = $event"
            @update:email-start="emailStart = $event"
            @update:email-end="emailEnd = $event"
            @update:email-step="emailStep = $event"
            @update:email-zero-pad="emailZeroPad = $event"
            @update:email-count="emailCount = $event"
            @update:email-suffix="emailSuffix = $event"
            @update:sha1-length="sha1Length = $event"
            @update:english-length="englishLength = $event"
            @update:email-case="emailCase = $event"
            @add-suffix="addSuffixOption"
            @remove-suffix="removeSuffixOption"
            @generate="generate"
        />

        <!-- 快捷复制 -->
        <div class="tools_section">
            <div class="section_header">
                <span class="section_title">快捷复制</span>
            </div>
            <div class="quick_copy_row">
                <span class="quick_copy_label">常用参数：</span>
                <span class="quick_copy_text" @click="quickCopy('testbit')">testbit</span>
                <span class="quick_copy_text" @click="quickCopy('testbit#P123')">testbit#P123</span>
            </div>
            <div class="quick_copy_phone_row">
                <span class="quick_copy_label">手机号：</span>
                <span class="quick_copy_phone" @click="copyPhone" title="点击复制，复制后自动 +1">{{ currentPhone }}</span>
                <el-input
                    v-model="phoneInput"
                    placeholder="设置初始手机号（11 位）"
                    size="small"
                    class="phone_input"
                    @keyup.enter="setPhone"
                />
                <el-button size="small" type="primary" @click="setPhone">设置</el-button>
                <span class="quick_copy_hint">点击手机号复制，复制后自动 +1</span>
            </div>
        </div>

        <!-- 书签工具 -->
        <BookmarkletPanel />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { coreState } from '../store/coreState'
import EmailGenPanel from '../components/EmailGenPanel.vue'
import BookmarkletPanel from '../components/BookmarkletPanel.vue'

const { emailGen } = coreState

const {
  emailMode,
  emailPrefix,
  emailStart,
  emailEnd,
  emailStep,
  emailZeroPad,
  emailCount,
  emailSuffix,
  emailSuffixOptions,
  sha1Length,
  englishLength,
  emailCase,
  emailList,
  generate,
  addSuffixOption,
  removeSuffixOption
} = emailGen

const quickCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({ message: `已复制: ${text}`, type: 'success' })
  } catch {
    ElMessage({ message: '复制失败', type: 'error' })
  }
}

// 手机号：可手动设置初始号，每次复制后自动 +1（localStorage 持久化，刷新不丢失）
const currentPhone = useStorage('fast_currentPhone', '13800000000')
const phoneInput = ref('')

const copyPhone = async () => {
  const phone = String(currentPhone.value)
  try {
    await navigator.clipboard.writeText(phone)
    ElMessage({ message: `已复制: ${phone}`, type: 'success' })
  } catch {
    ElMessage({ message: '复制失败', type: 'error' })
  }
  currentPhone.value = String(Number(phone) + 1)
}

const setPhone = () => {
  const val = phoneInput.value.trim()
  if (!/^\d{11}$/.test(val)) {
    ElMessage({ message: '请输入 11 位数字手机号', type: 'warning' })
    return
  }
  currentPhone.value = val
  phoneInput.value = ''
  ElMessage({ message: `初始手机号已设为 ${val}`, type: 'success' })
}
</script>

<style lang='scss' scoped>
.tools_page {
    min-height: 400px;
}
.tools_header {
    margin-bottom: 16px;
}
.tools_title {
    color: var(--el-color-primary);
    margin-bottom: 6px;
}
.tools_desc {
    font-size: 13px;
    opacity: 0.6;
    margin-bottom: 0;
}
.tools_section {
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}
.section_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.section_title {
    font-size: 15px;
    font-weight: 600;
    color: var(--g-body-text-color);
}
.quick_copy_row {
    display: flex;
    align-items: center;
    gap: 6px;
}
.quick_copy_label {
    font-size: 12px;
    color: var(--g-body-text-color-secondary);
    white-space: nowrap;
}
.quick_copy_phone_row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
}
.quick_copy_phone,
.quick_copy_text {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-color-primary);
    cursor: pointer;
    padding: 2px 10px;
    border-radius: 4px;
    border: 1px solid color-mix(in srgb, var(--el-color-primary) 30%, transparent);
    background-color: color-mix(in srgb, var(--el-color-primary) 8%, transparent);
    transition: all 0.2s;
    user-select: none;
}
.quick_copy_phone:hover,
.quick_copy_text:hover {
    color: #fff;
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
}
.phone_input {
    width: 170px;
}
.quick_copy_hint {
    font-size: 12px;
    color: var(--g-body-text-color-secondary);
    opacity: 0.6;
}
@media (max-width: 640px) {
    .quick_copy_row {
        flex-wrap: wrap;
    }
}
</style>
