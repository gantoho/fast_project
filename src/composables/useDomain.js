import { ElMessage } from 'element-plus'

const isValidHostname = (hostname) => {
    if (!hostname) return false
    if (hostname.length > 253) return false
    if (hostname.indexOf('.') === -1) return false
    if (hostname.startsWith('.') || hostname.endsWith('.')) return false
    if (hostname.startsWith('-') || hostname.endsWith('-')) return false
    const parts = hostname.split('.')
    for (const part of parts) {
        if (part.length === 0) return false
        if (part.length > 63) return false
        if (part.startsWith('-') || part.endsWith('-')) return false
        if (!/^[a-zA-Z0-9-]+$/.test(part)) return false
    }
    return true
}

export default function(metaData, subPathSwitch, subPath) {
    let count = 0
    if (metaData.value.trim().length <= 0) {
        ElMessage({ message: '至少输入一个域名', type: 'warning' })
        return { urlArr: [], err: new Error('至少输入一个域名') }
    }
    const lines = metaData.value.trim().split(/\r?\n/).filter(item => item.trim().length > 0)
    const urlArr = lines.map(line => {
        let item = line.trim()
        if (item.indexOf('https://') === 0 || item.indexOf('http://') === 0) {
            const rest = item.indexOf('://') + 3
            const slashIdx = item.indexOf('/', rest)
            const hostname = slashIdx === -1 ? item.slice(rest) : item.slice(rest, slashIdx)
            if (!isValidHostname(hostname)) {
                count++
            }
        } else {
            const slashIdx = item.indexOf('/')
            const hostname = slashIdx === -1 ? item : item.slice(0, slashIdx)
            if (!isValidHostname(hostname)) {
                count++
            }
        }
        if (item.indexOf("http://") === -1 && item.indexOf("https://") === -1) {
            if (subPathSwitch.value && subPath.value.trim().length > 0) {
                return 'http://' + (item.endsWith('/') ? item : item + '/') + subPath.value.trim()
            }
            return 'http://' + item
        }
        if (subPathSwitch.value && subPath.value.trim().length > 0) {
            return (item.endsWith('/') ? item : item + '/') + subPath.value.trim()
        }
        return item
    })
    if (count > 0) {
        ElMessage({ message: '请检查域名有误！！！', type: 'error' })
        console.warn('请检查域名有误！！！')
        return { urlArr, err: new Error('请检查域名有误！！！') }
    }
    return { urlArr, err: null }
}
