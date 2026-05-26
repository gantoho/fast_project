/**
 * 构建完整 URL：补全 http:// 前缀、拼接子路径、拼接选中的 query 参数
 * @param {string} raw - 原始输入行
 * @param {boolean} subPathSwitch - 是否启用子路径
 * @param {string} subPath - 子路径值
 * @param {Array} selectedQueryIds - 选中的 query id 数组
 * @param {Array} queryOptions - query 选项列表 [{ id, label, value }]
 * @returns {string} 完整 URL
 */
export function buildUrl(raw, subPathSwitch, subPath, selectedQueryIds = [], queryOptions = []) {
  const item = raw.trim()
  const currentSubPath = subPath ?? ''
  const hasPrefix = item.startsWith('http://') || item.startsWith('https://')

  let base = hasPrefix ? item : 'http://' + item

  if (subPathSwitch && currentSubPath.trim().length > 0) {
    base = (base.endsWith('/') ? base : base + '/') + currentSubPath.trim()
  }

  const ids = Array.isArray(selectedQueryIds) ? selectedQueryIds : []
  const opts = Array.isArray(queryOptions) ? queryOptions : []
  if (subPathSwitch && ids.length > 0 && opts.length > 0) {
    const parts = []
    for (const id of ids) {
      const opt = opts.find(o => o.id === id)
      if (!opt) continue
      let qstr = opt.value.trim()
      if (qstr.length === 0) continue
      // 去掉用户可能输入的前缀 ? 或 &
      if (qstr.startsWith('?')) qstr = qstr.slice(1)
      else if (qstr.startsWith('&')) qstr = qstr.slice(1)
      parts.push(qstr)
    }
    if (parts.length > 0) {
      base += '?' + parts.join('&')
    }
  }

  return base
}