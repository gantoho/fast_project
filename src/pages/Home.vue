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
    <div class="num">
        <i class="num_title">打开次数</i>
        <el-input-number class="num_box" v-model="numData" :min="1" :max="10" size="small" />
    </div>
    <div class="step">
        <i class="step_title">逐个打开</i>
        <el-switch
            v-model="isStepOpen"
            class="step_switch"
            inline-prompt
            style="--el-switch-on-color: #008cff; --el-switch-off-color: #c9c9c9;"
            active-text=""
            inactive-text=""
        />
        <template v-if="isStepOpen">
            <el-input-number class="step_input_num" v-model="stepNum" :min="1" :max="linksLen.length" size="small" />
            <el-switch
                v-model="stopStepFlag"
                class="stop_step"
                inline-prompt
                style="--el-switch-on-color: #ff4800; --el-switch-off-color: #474747;"
                :active-text="`从下标${stepCount}开始，逐个打开${stepNum}个`"
                :inactive-text="`禁用迭代，将要打开的为${stepCount}`"
            />
        </template>
    </div>
    <div class="btn_box">
        <el-button type="primary" @click="openLink">打开</el-button>
        <el-button type="danger" :icon="Delete" circle title="清空" @click="clear" />
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import useDomain from '../composables/useDomain'

const metaData = useStorage('fast_metaData', `https://zh-hans.react.dev/
https://svelte.dev/
https://cn.vuejs.org/
https://www.solidjs.com/
https://go.dev/
https://rust-lang.org`)

const data = reactive({
    urlArr: []
})
const linksLen = computed(() => {
    if (stepNum.value > metaData.value.trim().split(/\r?\n/).length) {
        stepNum.value = metaData.value.trim().split(/\r?\n/).length
    }
    return metaData.value.trim().split(/\r?\n/).map(item => {
        return item
    })
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
const openLink = () => {
    if (isStepOpen.value) {
        const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
        data.urlArr = urlArr
        if (err != null) {
            console.error(err)
        }

        for (let i = 0; i < stepNum.value; ++i) {
            for (let i = 0; i < numData.value; i++) {
                window.open(data.urlArr[stepCount.value], '_blank')
            }
            if (!stopStepFlag.value) {
                return
            }
            if (stepCount.value >= linksLen.value.length-1) {
                stepCount.value = 0
            } else {
                ++stepCount.value
            }

        }

        return
    }
    const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
    data.urlArr = urlArr
    if (err != null) {
        console.error(err)
    }
    data.urlArr.forEach(item => {
        for (let i = 0; i < numData.value; i++) {
            window.open(item, '_blank')
        }
    })
}
const clear = () => {
    metaData.value = ''
}

const numData = useStorage('fast_numData', 1)

const isStepOpen = useStorage('fast_isStepOpen', false)
const stepNum = useStorage('fast_stepNum', 1)
const stepCount = useStorage('fast_stepCount', 0)
const stopStepFlag = useStorage('fast_stopStepFlag', true)

</script>

<style lang='scss' scoped>
.input{
    margin-bottom: 20px;
}

.sub_path_module {
    border: 2px solid var(--g-home-link-border);
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
.num_title{
    font-style: normal;
}
.step{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .step_title{
        font-style: normal;
        margin-right: 10px;
    }
    .step_switch{
        margin-right: 10px;
    }
    .step_input_num{
        margin-right: 10px;
    }
}
.btn_box{
    display: flex;
    justify-content: space-between;
}
.num_box{
    margin-bottom: 20px;
    margin-left: 10px;
}
</style>
