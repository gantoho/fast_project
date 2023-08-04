<template>
    <el-input
        v-model="metaData"
        :autosize="{ minRows: 10, maxRows: 36 }"
        type="textarea"
        placeholder="Please input links"
        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: '#ffffff'}"
        class="input"
    />
    <i class="sub_path_title">子路径</i>
    <div class="sub_url_open">
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
            :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: ''}"
            placeholder="Please input sub path"
        />
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
const metaData = ref(`https://www.baidu.com/
http://www.sina.com.cn/
http://www.163.com/`)
const data = reactive({
    urlArr: []
})
const subPathSwitch = ref(false)
const subPath = ref('')
const btn = () => {
    if (metaData.value.trim().length <= 0) return ElMessage({ message: '至少输入一个域名', type: 'warning', });
    data.urlArr = metaData.value.trim().split(/\r?\n/)
    data.urlArr = data.urlArr.map(item => {
        if (item.indexOf("http://") === -1) {
            if (item.indexOf("https://") === -1) {
                if (subPathSwitch.value && subPath.value.trim().length > 0) {
                    return 'http://' + (item[item.length-1] === '/' ? item : (item + "/")) + subPath.value.trim()
                } else {
                    return 'http://' + item
                }
            } else {
                if (subPathSwitch.value && subPath.value.trim().length > 0) {
                    return (item[item.length-1] === '/' ? item : (item + "/")) + subPath.value.trim()
                } else {
                    return item
                }
            }

        } else {
            if (subPathSwitch.value && subPath.value.trim().length > 0) {
                return (item[item.length-1] === '/' ? item : (item + "/")) + subPath.value.trim()
            } else {
                return item
            }
        }
    })
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
    .sub_path_switch{
        margin-right: 10px;
    }
    .sub_path_input{
        background-color: rgba(0,0,0,0);
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