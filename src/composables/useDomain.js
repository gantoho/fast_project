import { ElMessage } from 'element-plus'
import { buildUrl } from '../utils/buildUrl'

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

const extractHostname = (raw) => {
    const item = raw.trim()
    const hasPrefix = item.startsWith('http://') || item.startsWith('https://')
    if (hasPrefix) {
        const rest = item.indexOf('://') + 3
        const slashIdx = item.indexOf('/', rest)
        return slashIdx === -1 ? item.slice(rest) : item.slice(rest, slashIdx)
    }
    const slashIdx = item.indexOf('/')
    return slashIdx === -1 ? item : item.slice(0, slashIdx)
}

export default function (metaData, subPathSwitch, subPath) {
    if (metaData.value.trim().length <= 0) {
        ElMessage({ message: '至少输入一个域名', type: 'warning' })
        return { urlArr: [], err: new Error('至少输入一个域名') }
    }

    const lines = metaData.value.trim().split(/\r?\n/).filter(item => item.trim().length > 0)
    let count = 0
    const urlArr = []

    for (const line of lines) {
        if (!isValidHostname(extractHostname(line))) {
            count++
        }
        urlArr.push(buildUrl(line, subPathSwitch.value, subPath.value))
    }

    if (count > 0) {
        ElMessage({ message: '请检查域名有误！！！', type: 'error' })
        console.warn('请检查域名有误！！！')
        return { urlArr, err: new Error('请检查域名有误！！！') }
    }
    return { urlArr, err: null }
}