import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useSubPath() {
  const subPathSwitch = useStorage('fast_subPathSwitch', false)
  const subPath = useStorage('fast_subPath', '')

  let pathId = useStorage('fast_pathId', 4)
  const options = useStorage('fast_options', [
    { id: '0', label: 'pu检查页面', value: 'client-notices' },
    { id: '1', label: 'partners检查页面', value: 'news' },
  ])

  const customPathInput = ref('')

  const addCustomPath = (val) => {
    if (!val) return
    if (options.value.some(item => item.value === val)) {
      ElMessage({ message: '该路径已存在', type: 'warning' })
      return
    }
    options.value.push({ id: String(pathId.value++), label: val, value: val })
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

  return {
    subPathSwitch,
    subPath,
    options,
    pathId,
    customPathInput,
    addCustomPath,
    removeCustomPath
  }
}