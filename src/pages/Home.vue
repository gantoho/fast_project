<template>
    <el-input
        v-model="metaData"
        :autosize="{ minRows: 10, maxRows: 36 }"
        type="textarea"
        placeholder="Please input links"
        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
        class="input"
    />
    <div class="sub_path_module">
        <div class="sub_path_header">
            <span class="sub_path_label">子路径</span>
            <el-switch
                v-model="subPathSwitch"
                inline-prompt
                style="--el-switch-on-color: #53c587; --el-switch-off-color: #c9c9c9"
                active-text="启用"
                inactive-text="禁用"
            />
        </div>
        <template v-if="subPathSwitch">
            <div class="sub_path_selector">
                <el-select
                    v-model="subPath"
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
                    v-model="subPath"
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
                        @close="removeCustomPath(item.id)"
                        class="sub_path_tag"
                    >
                        {{ item.label }}
                    </el-tag>
                </div>
                <p class="sub_path_custom_empty" v-else>暂无自定义路径，在上方添加</p>
            </div>
        </template>
    </div>
    <div class="step_module">
        <div class="step_header">
            <span class="step_label">逐个打开</span>
            <el-switch
                v-model="isStepOpen"
                inline-prompt
                style="--el-switch-on-color: #008cff; --el-switch-off-color: #c9c9c9;"
                active-text="启用"
                inactive-text="禁用"
            />
        </div>
        <template v-if="isStepOpen">
            <div class="step_tags">
                <template v-if="hasLinks">
                    <el-tag
                        v-for="(link, i) in linkList"
                        :key="i"
                        :type="tagStatus[i]?.type || 'info'"
                        :effect="tagStatus[i]?.effect || 'plain'"
                        size="small"
                        class="step_tag"
                        @click="onStepClick(i)"
                    >
                        {{ i + 1 }}
                    </el-tag>
                </template>
                <p v-else class="step_tags_empty">暂无有效链接</p>
            </div>
            <div class="step_url_box">
                <el-button :icon="ArrowLeft" :disabled="!hasLinks || (!stepLoop && !stepTrueLoop && stepIndex <= 0)" @click="onStepPrev" circle size="small" />
                <div class="step_url_text">
                    <div v-for="(item, j) in batchLinks" :key="j" class="step_url_item">{{ item.url }}</div>
                    <p v-if="!hasLinks" class="step_url_empty">暂无有效链接</p>
                </div>
                <el-button :icon="ArrowRight" :disabled="!hasLinks || (!stepLoop && !stepTrueLoop && stepIndex >= linkList.length - 1)" @click="onStepNext" circle size="small" />
            </div>
            <div class="step_controls">
                <div class="step_control">
                    <span class="step_control_label">每次打开</span>
                    <el-input-number v-model="stepBatchSize" :min="1" :max="linkList.length || 1" size="small" />
                    <span class="step_control_unit">个</span>
                </div>
                <div class="step_control">
                    <span class="step_control_label">自动推进</span>
                    <el-switch v-model="stepAutoAdvance" size="small" />
                </div>
                <div class="step_control">
                    <span class="step_control_label">到头重置</span>
                    <el-switch v-model="stepLoop" size="small" />
                </div>
                <div class="step_control">
                    <span class="step_control_label">连续循环</span>
                    <el-switch v-model="stepTrueLoop" size="small" />
                </div>
            </div>
        </template>
    </div>
    <div class="config_bar">
        <div class="config_group">
            <span class="config_label">打开次数</span>
            <el-input-number v-model="numData" :min="1" :max="10" size="small" controls-position="right" />
            <span class="config_unit">次</span>
        </div>
        <span class="config_sep"></span>
        <div class="config_group">
            <span class="config_label">打开延迟</span>
            <el-switch v-model="openDelaySwitch" size="small" />
            <template v-if="openDelaySwitch">
                <el-input-number v-model="openDelay" :min="100" :max="10000" :step="100" size="small" controls-position="right" />
                <span class="config_unit">ms</span>
            </template>
        </div>
    </div>
    <div class="btn_box">
        <el-button type="primary" :disabled="!hasLinks" @click="openLink">{{ isStepOpen ? `打开下一批 (${stepBatchSize}个，共${stepBatchSize * numData}次)` : `全部打开 (共${linkList.length * numData}次)` }}</el-button>
        <el-button type="danger" :icon="Delete" circle title="清空" @click="clear" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { Delete, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import useDomain from '../composables/useDomain'

const metaData = useStorage('fast_metaData', `https://zh-hans.react.dev/
https://svelte.dev/
https://cn.vuejs.org/
https://www.solidjs.com/
https://go.dev/
https://rust-lang.org`)

const linkList = computed(() => {
    return metaData.value.trim().split(/\r?\n/).filter(item => item.trim().length > 0)
})

const hasLinks = computed(() => linkList.value.length > 0)

const processUrl = (raw) => {
    const item = raw.trim()
    if (item.indexOf('http://') === 0 || item.indexOf('https://') === 0) {
        if (subPathSwitch.value && subPath.value.trim().length > 0) {
            return (item.endsWith('/') ? item : item + '/') + subPath.value.trim()
        }
        return item
    }
    if (subPathSwitch.value && subPath.value.trim().length > 0) {
        return 'http://' + (item.endsWith('/') ? item : item + '/') + subPath.value.trim()
    }
    return 'http://' + item
}

const processedUrlList = computed(() => {
    return linkList.value.map(item => processUrl(item))
})

const useWrap = computed(() => stepTrueLoop.value)

const batchLinks = computed(() => {
    if (!processedUrlList.value.length) return []
    const result = []
    const total = processedUrlList.value.length
    for (let i = 0; i < stepBatchSize.value; i++) {
        const idx = useWrap.value ? (stepIndex.value + i) % total : stepIndex.value + i
        if (idx >= total) break
        if (result.some(item => item.index === idx)) break
        result.push({ index: idx, url: processedUrlList.value[idx] })
    }
    return result
})

const tagStatus = computed(() => {
    if (!processedUrlList.value.length) return []
    const total = processedUrlList.value.length
    const batchSet = new Set()
    for (let j = 0; j < stepBatchSize.value; j++) {
        const idx = useWrap.value ? (stepIndex.value + j) % total : stepIndex.value + j
        if (idx >= total) break
        batchSet.add(idx)
    }
    return linkList.value.map((_, i) => ({
        type: batchSet.has(i) ? 'primary' : (stepOpened.value.includes(i) ? 'success' : 'info'),
        effect: batchSet.has(i) ? 'dark' : 'plain'
    }))
})

let pathId = useStorage('fast_pathId', 4)
const options = useStorage('fast_options', [
    { id: '0', label: '登录', value: '?_login_form=puglogin' },
    { id: '1', label: '后台', value: 'wp-admin' },
    { id: '2', label: 'partners检查页面', value: 'news' },
    { id: '3', label: 'pu检查页面', value: 'client-notices' },
])

const customPathInput = ref('')
const addCustomPath = () => {
    const val = customPathInput.value.trim()
    if (!val) return
    if (options.value.some(item => item.value === val)) {
        ElMessage({ message: '该路径已存在', type: 'warning' })
        return
    }
    options.value.push({ id: String(pathId.value++), label: val, value: val })
    customPathInput.value = ''
}
const removeCustomPath = (id) => {
    options.value = options.value.filter(item => item.id !== id)
}

const subPathSwitch = useStorage('fast_subPathSwitch', true)
const subPath = useStorage('fast_subPath', '')

const openLink = async () => {
    if (isStepOpen.value) {
        await openStepBatch()
        return
    }
    const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
    if (err != null) {
        console.error(err)
        return
    }
    for (const item of urlArr) {
        for (let i = 0; i < numData.value; i++) {
            window.open(item, '_blank')
            if (openDelaySwitch.value) await sleep(openDelay.value)
        }
    }
}
const clear = () => {
    metaData.value = ''
}

const numData = useStorage('fast_numData', 1)
const openDelaySwitch = useStorage('fast_openDelaySwitch', false)
const openDelay = useStorage('fast_openDelay', 500)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const isStepOpen = useStorage('fast_isStepOpen', false)
const stepIndex = ref(0)
const stepBatchSize = useStorage('fast_stepBatchSize', 1)
const stepAutoAdvance = useStorage('fast_stepAutoAdvance', true)
const stepLoop = useStorage('fast_stepLoop', false)
const stepTrueLoop = useStorage('fast_stepTrueLoop', true)
const stepOpened = useStorage('fast_stepOpened', [])

watch(stepLoop, (val) => {
    if (val) stepTrueLoop.value = false
})
watch(stepTrueLoop, (val) => {
    if (val) stepLoop.value = false
})

const markOpened = (idx) => {
    if (!stepOpened.value.includes(idx)) {
        stepOpened.value = [...stepOpened.value, idx]
    }
}

const openStepBatch = async () => {
    if (!linkList.value.length) return
    const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
    if (err) return
    const bothOff = !stepLoop.value && !stepTrueLoop.value
    const max = bothOff ? Math.min(stepBatchSize.value, urlArr.length - stepIndex.value) : stepBatchSize.value
    const opened = new Set()
    for (let i = 0; i < max; i++) {
        const idx = stepTrueLoop.value ? (stepIndex.value + i) % urlArr.length : stepIndex.value + i
        if (idx >= urlArr.length) break
        if (opened.has(idx)) break
        opened.add(idx)
        for (let j = 0; j < numData.value; j++) {
            window.open(urlArr[idx], '_blank')
            if (openDelaySwitch.value) await sleep(openDelay.value)
        }
        markOpened(idx)
    }
    if (stepAutoAdvance.value) {
        advanceIndex(opened.size)
    }
}

const advanceIndex = (step) => {
    if (stepTrueLoop.value) {
        stepIndex.value = (stepIndex.value + step) % (linkList.value.length || 1)
    } else if (stepLoop.value) {
        let next = stepIndex.value + step
        if (next >= linkList.value.length) {
            next = 0
        }
        stepIndex.value = next
    } else {
        stepIndex.value = Math.min(stepIndex.value + step, linkList.value.length - 1)
    }
}

const onStepClick = (i) => {
    stepIndex.value = i
}

const onStepPrev = () => {
    const step = stepBatchSize.value
    const total = linkList.value.length
    if (stepTrueLoop.value) {
        stepIndex.value = (stepIndex.value - step + total) % total
    } else if (stepLoop.value) {
        let next = stepIndex.value - step
        if (next < 0) next = total - 1
        stepIndex.value = next
    } else {
        stepIndex.value = Math.max(0, stepIndex.value - step)
    }
}

const onStepNext = () => {
    const step = stepBatchSize.value
    const total = linkList.value.length
    if (stepTrueLoop.value) {
        stepIndex.value = (stepIndex.value + step) % total
    } else if (stepLoop.value) {
        let next = stepIndex.value + step
        if (next >= total) next = 0
        stepIndex.value = next
    } else {
        stepIndex.value = Math.min(total - 1, stepIndex.value + step)
    }
}

</script>

<style lang='scss' scoped>
.input{
    margin-bottom: 20px;
}

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
}
.sub_path_custom_empty {
    margin-top: 12px;
    font-size: 13px;
    opacity: 0.5;
    font-style: normal;
}
.config_bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    margin-bottom: 20px;
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
.config_unit {
    font-style: normal;
    font-size: 12px;
    color: var(--g-body-text-color);
    opacity: 0.5;
    white-space: nowrap;
}
.step_module {
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}
.step_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .step_label {
        font-style: normal;
        font-size: 15px;
        font-weight: 600;
    }
}
.step_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
}
.step_tag {
    cursor: pointer;
    font-size: 12px;
    &.el-tag--primary.el-tag--dark {
        --el-tag-bg-color: #6c7bff;
        --el-tag-text-color: #fff;
        --el-tag-border-color: #6c7bff;
    }
    &.el-tag--info.el-tag--plain {
        --el-tag-bg-color: transparent;
        --el-tag-text-color: var(--g-body-text-color);
        --el-tag-border-color: var(--g-home-link-border);
    }
    &.el-tag--info.el-tag--dark {
        --el-tag-bg-color: var(--g-tabbar-border);
        --el-tag-text-color: var(--g-body-text-color);
        --el-tag-border-color: var(--g-tabbar-border);
    }
    &.el-tag--success.el-tag--plain {
        --el-tag-bg-color: transparent;
        --el-tag-text-color: #53c587;
        --el-tag-border-color: #53c587;
    }
}
.step_tags_empty {
    font-style: normal;
    font-size: 13px;
    color: var(--g-body-text-color);
    opacity: 0.4;
    margin: 0;
}
.step_url_box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding: 10px 14px;
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    .step_url_text {
        flex: 1;
        font-size: 13px;
        color: var(--g-body-text-color);
        line-height: 1.4;
        overflow: hidden;
    }
    .step_url_item {
        padding: 1px 0;
        word-break: break-all;
    }
    .step_url_item + .step_url_item {
        border-top: 1px solid var(--g-home-link-border);
        padding-top: 3px;
        margin-top: 3px;
    }
    .step_url_empty {
        font-style: normal;
        font-size: 13px;
        color: var(--g-body-text-color);
        opacity: 0.4;
        margin: 0;
    }
}
.step_controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 14px;
    .step_control {
        display: flex;
        align-items: center;
        gap: 6px;
        .step_control_label,
        .step_control_unit {
            font-style: normal;
            font-size: 13px;
        }
    }
}
.btn_box{
    display: flex;
    justify-content: space-between;
}
</style>
