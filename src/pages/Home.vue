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
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            />
        </el-select>
    </div>
    <i class="num_title">打开次数</i>
    <el-input-number class="num_box" v-model="numData" :min="1" :max="10" size="small" @change="numHandleChange" />
    <div class="btn_box">
        <el-button type="primary" @click="btn">打开</el-button>
        <el-button type="danger" :icon="Delete" circle title="清空" @click="clear" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, } from '@element-plus/icons-vue'
import useDomain from '../hooks/useDomain';
const metaData = ref(`https://zh-hans.react.dev/
https://go.dev/
https://gin-gonic.com/zh-cn/`)
const data = reactive({
    urlArr: []
})
const options = [
    {
        label: '后台登录',
        value: 'puglogin',
    },
    {
        label: '后台',
        value: 'wp-admin',
    },
    {
        label: '联系我们',
        value: 'contact-us',
    },
]
const subPathSwitch = ref(false)
const subPath = ref('')
const btn = () => {
    const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
    data.urlArr = urlArr
    if (err != null) {
        console.error(err)
    }
    data.urlArr.forEach(item => {
        console.log(item)
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
    console.log(value, numData.value)
}
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
.btn_box{
    display: flex;
    justify-content: space-between;
}
.num_box{
    margin-bottom: 20px;
    margin-left: 10px;
}
</style>