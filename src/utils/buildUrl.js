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

  // 分离已有 query 参数
  const queryIdx = item.indexOf('?')
  let basePart = item
  let existingQuery = ''
  if (queryIdx !== -1) {
    basePart = item.slice(0, queryIdx)
    existingQuery = item.slice(queryIdx + 1)
  }

  // 补全 http:// 前缀
  const hasPrefix = basePart.startsWith('http://') || basePart.startsWith('https://')
  let base = hasPrefix ? basePart : 'http://' + basePart

  // 拼接子路径
  if (subPathSwitch && currentSubPath.trim().length > 0) {
    const sp = currentSubPath.trim()
    base = base.endsWith('/') || sp.startsWith('/') ? base + sp : base + '/' + sp
  }

  // 收集新增的 query 参数
  const ids = Array.isArray(selectedQueryIds) ? selectedQueryIds : []
  const opts = Array.isArray(queryOptions) ? queryOptions : []
  if (subPathSwitch && ids.length > 0 && opts.length > 0) {
    const parts = []
    for (const id of ids) {
      const opt = opts.find(o => o.id === id)
      if (!opt) continue
      let qstr = opt.value.trim()
      if (qstr.length === 0) continue
      if (qstr.startsWith('?')) qstr = qstr.slice(1)
      else if (qstr.startsWith('&')) qstr = qstr.slice(1)
      parts.push(qstr)
    }
    if (parts.length > 0) {
      const allQuery = [existingQuery, ...parts].filter(Boolean).join('&')
      base += '?' + allQuery
    } else if (existingQuery) {
      base += '?' + existingQuery
    }
  } else if (existingQuery) {
    base += '?' + existingQuery
  }

  return base
}