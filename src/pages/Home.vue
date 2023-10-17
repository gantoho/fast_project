<template>
    <el-input
        v-model="metaData"
        :autosize="{ minRows: 10, maxRows: 36 }"
        type="textarea"
        placeholder="Please input links"
        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: '#ffffff'}"
        class="input"
    />
    <div class="sub_url_open">
        <i class="sub_path_title">子路径</i>
        <el-switch
            v-model="subPathSwitch"
            class="sub_path_switch"
            inline-prompt
            style="--el-switch-on-color: #53c587; --el-switch-off-color: #c9c9c9"
            active-text="打开子路径"
            inactive-text=""
        />
        <el-input
            v-if="subPathSwitch"
            v-model="subPath"
            class="sub_path_input"
            :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: '#fff000'}"
            placeholder="Please input sub path"
        />
        <el-select
            v-model="subPath"
            placeholder="Select Path"
            v-if="subPathSwitch"
            effect="dark"
            clearable
            placement="right-start"
        >
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            />
        </el-select>
    </div>
    <div class="sub_rule">
        <p>
            <span>子路径添加</span>
            <el-switch
                v-model="subRuleSwitch"
                class="sub_rule_switch"
                inline-prompt
                style="--el-switch-on-color: #53c587; --el-switch-off-color: #c9c9c9"
                active-text=""
                inactive-text=""
            />
        </p>
        <el-input
            v-if="subRuleSwitch"
            v-model="subRule"
            :autosize="{ minRows: 2 }"
            type="textarea"
            placeholder="此处添加需要打开的多个子路径，一行只能存在一个子路径。添加的多个子路径，请在“子路径”栏选择。"
            :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: '#ffffff'}"
            class="input"
        />
    </div>
    <div class="num">
        <i class="num_title">打开次数</i>
        <el-input-number class="num_box" v-model="numData" :min="1" :max="10" size="small" @change="numHandleChange" />
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
            <el-input-number class="step_input_num" v-model="stepNum" :min="1" :max="linksLen.length" size="small" @change="numHandleChange" />
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
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, } from '@element-plus/icons-vue'
import useDomain from '../hooks/useDomain';
import debounce from '../utils/debounce.js'
const metaData = ref(`https://zh-hans.react.dev/
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
const options = ref([
    {
        id: '0',
        label: '后台',
        value: 'wp-admin/admin.php?page=wpengine-common&tab=caching',
    },
    {
        id: '1',
        label: '新闻',
        value: 'news',
    },
])
const subRule = ref()
const subRuleSwitch = ref(false)
watch(subRule, debounce(() => {
    console.log(subRule.value.trim().split(/\r?\n/))
    options.value = subRule.value.trim().split(/\r?\n/).map((item, index) => {
        return { label: item, value: item, id: index+item }
    })
}, 1000))
const subPathSwitch = ref(false)
const subPath = ref('')
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

const numData = ref(1)

const numHandleChange = (value) => {
    console.log(value)
}

const isStepOpen = ref(false)
const stepNum = ref(1)
const stepCount = ref(0);
const stopStepFlag = ref(true)

</script>

<style lang='scss' scoped>
.input{
    margin-bottom: 20px;
}
.sub_url_open{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .sub_path_title{
        margin-right: 10px;
        white-space: nowrap;
    }
    .sub_path_switch{
        margin-right: 10px;
    }
    .sub_path_input{
        background-color: rgba(0,0,0,0);
        margin-right: 10px;
    }
}
.sub_path_title,
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
.sub_rule{
    p{
        margin-bottom: 20px;
        span{
            margin-right: 10px;
        }
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
