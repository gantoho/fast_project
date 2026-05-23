import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 跨组件桥接：Home.vue 设置函数，ThemePanel 读取
const exportBridge = ref(null)
const importBridge = ref(null)

export function useGlobalExportBridge() {
  return { exportBridge, importBridge }
}

/**
 * 全局导入导出：导出全站所有数据到一个 JSON 文件，或从 JSON 文件完整恢复。
 */
export function useGlobalExport(state) {
  const exportAll = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      metaData: state.metaData.value,
      subPathSwitch: state.subPathSwitch.value,
      subPath: state.subPath.value,
      options: state.options.value,
      queryOptions: state.queryOptions.value,
      selectedQueryIds: state.selectedQueryIds.value,
      numData: state.numData.value,
      openDelaySwitch: state.openDelaySwitch.value,
      openDelay: state.openDelay.value,
      isStepOpen: state.isStepOpen.value,
      stepBatchSize: state.stepBatchSize.value,
      stepAutoAdvance: state.stepAutoAdvance.value,
      stepLoop: state.stepLoop.value,
      stepTrueLoop: state.stepTrueLoop.value,
      presets: state.presets?.value ?? [],
      activePresetId: state.activePresetId?.value ?? '',
      darkMode: state.darkMode?.value ?? 'light',
      styleKey: state.styleKey?.value ?? 'default'
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fast_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage({ message: '全站数据已导出', type: 'success' })
  }

  const importAll = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        ElMessage({ message: 'JSON 解析失败，请确认文件未被损坏', type: 'error' })
        e.target.value = ''
        return
      }

      if (!data || typeof data !== 'object') {
        ElMessage({ message: '文件格式不正确，应为 JSON 对象', type: 'error' })
        e.target.value = ''
        return
      }

      // 选择导入模式：覆盖 or 合并
      let mode = 'overwrite'
      try {
        await ElMessageBox.confirm(
          '请选择导入方式：',
          '导入全站数据',
          {
            confirmButtonText: '覆盖导入',
            cancelButtonText: '合并导入',
            distinguishCancelAndClose: true,
            type: 'warning'
          }
        )
        mode = 'overwrite'
      } catch (err) {
        if (err === 'close') {
          e.target.value = ''
          return
        }
        mode = 'merge'
      }

      if (mode === 'overwrite') {
        if (data.metaData !== undefined) state.metaData.value = data.metaData
        if (data.subPathSwitch !== undefined) state.subPathSwitch.value = data.subPathSwitch
        if (data.subPath !== undefined) state.subPath.value = data.subPath
        if (Array.isArray(data.options)) state.options.value = data.options
        if (Array.isArray(data.queryOptions)) state.queryOptions.value = data.queryOptions
        if (Array.isArray(data.selectedQueryIds)) state.selectedQueryIds.value = data.selectedQueryIds
        if (data.numData !== undefined) state.numData.value = data.numData
        if (data.openDelaySwitch !== undefined) state.openDelaySwitch.value = data.openDelaySwitch
        if (data.openDelay !== undefined) state.openDelay.value = data.openDelay
        if (data.isStepOpen !== undefined) state.isStepOpen.value = data.isStepOpen
        if (data.stepBatchSize !== undefined) state.stepBatchSize.value = data.stepBatchSize
        if (data.stepAutoAdvance !== undefined) state.stepAutoAdvance.value = data.stepAutoAdvance
        if (data.stepLoop !== undefined) state.stepLoop.value = data.stepLoop
        if (data.stepTrueLoop !== undefined) state.stepTrueLoop.value = data.stepTrueLoop
        if (Array.isArray(data.presets)) state.presets.value = data.presets
        if (data.activePresetId !== undefined) state.activePresetId.value = data.activePresetId
        if (data.darkMode !== undefined) state.darkMode.value = data.darkMode
        if (data.styleKey !== undefined) {
          state.styleKey.value = data.styleKey
          if (data.styleKey === 'default') {
            document.documentElement.removeAttribute('data-style')
          } else {
            document.documentElement.setAttribute('data-style', data.styleKey)
          }
        }
      } else {
        // 合并模式：数组去重合并，标量值保留当前值不覆盖
        if (Array.isArray(data.options)) {
          const currentIds = new Set(state.options.value.map(o => o.id))
          const newItems = data.options.filter(o => !currentIds.has(o.id))
          if (newItems.length) state.options.value = [...state.options.value, ...newItems]
        }
        if (Array.isArray(data.queryOptions)) {
          const currentIds = new Set(state.queryOptions.value.map(o => o.id))
          const newItems = data.queryOptions.filter(o => !currentIds.has(o.id))
          if (newItems.length) state.queryOptions.value = [...state.queryOptions.value, ...newItems]
        }
        if (Array.isArray(data.selectedQueryIds)) {
          const currentSet = new Set(state.selectedQueryIds.value)
          for (const id of data.selectedQueryIds) {
            if (!currentSet.has(id)) state.selectedQueryIds.value.push(id)
          }
        }
        if (Array.isArray(data.presets)) {
          const currentIds = new Set(state.presets.value.map(p => p.id))
          const newItems = data.presets.filter(p => !currentIds.has(p.id))
          if (newItems.length) state.presets.value = [...state.presets.value, ...newItems]
        }
      }

      ElMessage({ message: mode === 'overwrite' ? '全站数据已覆盖导入' : '全站数据已合并导入', type: 'success' })
    } catch (err) {
      if (err !== 'cancel' && err !== 'close') {
        console.error('导入全站数据失败:', err)
        ElMessage({ message: '导入失败：' + (err?.message || '文件解析失败，请检查文件格式'), type: 'error' })
      }
    }
    e.target.value = ''
  }

  // 注册到桥接，供 ThemePanel 读取
  exportBridge.value = exportAll
  importBridge.value = importAll

  return { exportAll, importAll }
}