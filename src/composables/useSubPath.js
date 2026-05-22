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

  return {
    subPathSwitch,
    subPath,
    options,
    pathId,
    addCustomPath,
    removeCustomPath,
    updateCustomPath,
    reorderPaths
  }
}