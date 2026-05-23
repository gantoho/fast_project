import { useStorage } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useSubPath() {
  const subPathSwitch = useStorage('fast_subPathSwitch', false)
  const subPath = useStorage('fast_subPath', '')

  const pathId = useStorage('fast_pathId', 4)
  const options = useStorage('fast_options', [
    { id: '0', label: 'pu检查页面', value: 'client-notices' },
    { id: '1', label: 'partners检查页面', value: 'news' },
  ])

  // ---- query ----
  let queryId = useStorage('fast_queryId', 0)
  const queryOptions = useStorage('fast_queryOptions', [])
  const selectedQueryIds = useStorage('fast_selectedQueryIds', [])

  const addCustomPath = (label, value) => {
    if (!label || !value) {
      ElMessage({ message: '名称和路径不能为空', type: 'warning' })
      return
    }
    if (options.value.some(item => item.value === value)) {
      ElMessage({ message: '该路径已存在', type: 'warning' })
      return
    }
    options.value.push({ id: String(pathId.value++), label, value })
  }

  const removeCustomPath = async (id) => {
    const item = options.value.find(o => o.id === id)
    if (!item) return
    try {
      await ElMessageBox.confirm(`确定删除自定义路径「${item.label}」？`, '删除路径', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      })
      options.value = options.value.filter(o => o.id !== id)
    } catch { }
  }

  const updateCustomPath = (id, label, value) => {
    const trimmedLabel = label.trim()
    const trimmedValue = value.trim()
    if (!trimmedLabel || !trimmedValue) {
      ElMessage({ message: '名称和路径不能为空', type: 'warning' })
      return false
    }
    const dup = options.value.find(o => o.value === trimmedValue && o.id !== id)
    if (dup) {
      ElMessage({ message: '该路径已存在', type: 'warning' })
      return false
    }
    const item = options.value.find(o => o.id === id)
    if (item) {
      item.label = trimmedLabel
      item.value = trimmedValue
    }
    return true
  }

  const reorderPaths = (newOptions) => {
    options.value = newOptions
  }

  // ---- query methods ----
  const addQueryOption = (label, value) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      ElMessage({ message: 'query 参数不能为空', type: 'warning' })
      return
    }
    if (queryOptions.value.some(item => item.value === trimmedValue)) {
      ElMessage({ message: '该参数已存在', type: 'warning' })
      return
    }
    const name = label.trim() || trimmedValue
    queryOptions.value.push({ id: String(queryId.value++), label: name, value: trimmedValue })
  }

  const removeQueryOption = async (id) => {
    const item = queryOptions.value.find(o => o.id === id)
    if (!item) return
    try {
      await ElMessageBox.confirm(`确定删除 query「${item.label}」？`, '删除参数', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      })
      queryOptions.value = queryOptions.value.filter(o => o.id !== id)
      selectedQueryIds.value = selectedQueryIds.value.filter(sid => sid !== id)
    } catch { }
  }

  const updateQueryOption = (id, label, value) => {
    const trimmedLabel = label.trim()
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      ElMessage({ message: 'query 参数不能为空', type: 'warning' })
      return false
    }
    const dup = queryOptions.value.find(o => o.value === trimmedValue && o.id !== id)
    if (dup) {
      ElMessage({ message: '该参数已存在', type: 'warning' })
      return false
    }
    const item = queryOptions.value.find(o => o.id === id)
    if (item) {
      item.label = trimmedLabel || trimmedValue
      item.value = trimmedValue
    }
    return true
  }

  const reorderQueryOptions = (newOptions) => {
    queryOptions.value = newOptions
  }

  const toggleQuery = (id) => {
    const idx = selectedQueryIds.value.indexOf(id)
    if (idx === -1) {
      selectedQueryIds.value = [...selectedQueryIds.value, id]
    } else {
      const arr = [...selectedQueryIds.value]
      arr.splice(idx, 1)
      selectedQueryIds.value = arr
    }
  }

  return {
    subPathSwitch,
    subPath,
    queryOptions,
    selectedQueryIds,
    options,
    pathId,
    addCustomPath,
    removeCustomPath,
    updateCustomPath,
    reorderPaths,
    addQueryOption,
    removeQueryOption,
    updateQueryOption,
    reorderQueryOptions,
    toggleQuery
  }
}