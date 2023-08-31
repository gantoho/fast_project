import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
export default function(metaData, subPathSwitch, subPath) {
    const data = reactive({
        urlArr: []
    })
    const _err = reactive({})
    let count = 0;
    if (metaData.value.trim().length <= 0) return ElMessage({ message: '至少输入一个域名', type: 'warning', });
    data.urlArr = metaData.value.trim().split(/\r?\n/)
    data.urlArr = data.urlArr.filter(item => {
        return item.trim().length > 0
    })
    data.urlArr.forEach(item => {
        const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([a-z]{2,6})$/
        item = item.indexOf("https://") !== -1 ? item.replace(new RegExp("https://"), "") : item;
        item = item.indexOf("http://") !== -1 ? item.replace(new RegExp("http://"), "") : item;
        item = item.indexOf('/') === -1 ? item : item.slice(0, item.indexOf('/')) ;
        console.log(item)
        const flag = regex.test(item.trim())
        if(!flag) {
            count++;
        }
    })
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
    count > 0 ? ElMessage({ message: '请检查域名有误！！！', type: 'error', }) : null
    count > 0 ? console.warn("请检查域名有误！！！") : ''
    return {urlArr: data.urlArr, err: (count > 0 ? new Error("请检查域名有误！！！") : null)}
}