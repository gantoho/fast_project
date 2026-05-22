/**
 * 构建完整 URL：补全 http:// 前缀、拼接子路径
 * @param {string} raw - 原始输入行
 * @param {boolean} subPathSwitch - 是否启用子路径
 * @param {string} subPath - 子路径值
 * @returns {string} 完整 URL
 */
export function buildUrl(raw, subPathSwitch, subPath) {
  const item = raw.trim()
  const currentSubPath = subPath ?? ''
  const hasPrefix = item.startsWith('http://') || item.startsWith('https://')

  if (subPathSwitch && currentSubPath.trim().length > 0) {
    const base = hasPrefix ? item : 'http://' + item
    return (base.endsWith('/') ? base : base + '/') + currentSubPath.trim()
  }

  return hasPrefix ? item : 'http://' + item
}