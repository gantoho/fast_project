import { ref, watch, onMounted, nextTick } from 'vue'
import { useStorage } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'

const defaultPresetId = 'default'
const defaultSnapshot = {
  metaData: `https://zh-hans.react.dev/
https://svelte.dev/
https://cn.vuejs.org/
https://www.solidjs.com/
https://go.dev/
https://rust-lang.org`,
  subPathSwitch: false,
  subPath: '',
  options: [
    { id: '0', label: 'pu检查页面', value: 'client-notices' },
    { id: '1', label: 'partners检查页面', value: 'news' },
  ],
  pathId: 2,
  numData: 1,
  openDelaySwitch: false,
  openDelay: 500,
  isStepOpen: false,
  stepBatchSize: 1,
  stepAutoAdvance: true,
  stepLoop: false,
  stepTrueLoop: true,
  stepOpened: [],
  stepIndex: 0
}

export function usePreset(state) {
  let presetId = useStorage('fast_presetId', 1)
  const presets = useStorage('fast_presets', [
    { id: defaultPresetId, name: '默认预设', snapshot: defaultSnapshot }
  ])
  const activePresetId = useStorage('fast_activePresetId', defaultPresetId)
  const presetNameInput = ref('')
  const isApplyingPreset = ref(false)
  const presetReady = ref(false)

  const getSnapshot = () => ({
    metaData: state.metaData.value,
    subPathSwitch: state.subPathSwitch.value,
    subPath: state.subPath.value,
    options: state.options.value,
    pathId: state.pathId.value,
    numData: state.numData.value,
    openDelaySwitch: state.openDelaySwitch.value,
    openDelay: state.openDelay.value,
    isStepOpen: state.isStepOpen.value,
    stepBatchSize: state.stepBatchSize.value,
    stepAutoAdvance: state.stepAutoAdvance.value,
    stepLoop: state.stepLoop.value,
    stepTrueLoop: state.stepTrueLoop.value,
    stepOpened: state.stepOpened.value,
    stepIndex: state.stepIndex.value
  })

  const applySnapshot = (snap) => {
    state.metaData.value = snap.metaData
    state.subPathSwitch.value = snap.subPathSwitch
    state.subPath.value = snap.subPath
    state.options.value = snap.options
    state.pathId.value = snap.pathId
    state.numData.value = snap.numData
    state.openDelaySwitch.value = snap.openDelaySwitch
    state.openDelay.value = snap.openDelay
    state.isStepOpen.value = snap.isStepOpen
    state.stepBatchSize.value = snap.stepBatchSize
    state.stepAutoAdvance.value = snap.stepAutoAdvance
    state.stepLoop.value = snap.stepLoop
    state.stepTrueLoop.value = snap.stepTrueLoop
    state.stepOpened.value = snap.stepOpened
    state.stepIndex.value = snap.stepIndex
  }

  const savePreset = () => {
    const name = presetNameInput.value.trim()
    if (!name) return
    const existing = presets.value.find(p => p.name === name)
    if (existing) {
      presets.value = presets.value.map(p =>
        p.id === existing.id ? { ...p, snapshot: getSnapshot() } : p
      )
      ElMessage({ message: `预设「${name}」已更新`, type: 'success' })
      activePresetId.value = existing.id
    } else {
      const id = String(presetId.value++)
      presets.value = [...presets.value, { id, name, snapshot: getSnapshot() }]
      ElMessage({ message: `预设「${name}」已保存`, type: 'success' })
      activePresetId.value = id
    }
    presetNameInput.value = ''
  }

  const applyPreset = async (item) => {
    isApplyingPreset.value = true
    applySnapshot(item.snapshot)
    activePresetId.value = item.id
    await nextTick()
    isApplyingPreset.value = false
    ElMessage({ message: `已恢复预设「${item.name}」`, type: 'success' })
  }

  const deletePreset = async (item) => {
    try {
      await ElMessageBox.confirm(`确定删除预设「${item.name}」？此操作不可恢复。`, '删除预设', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      })
      presets.value = presets.value.filter(p => p.id !== item.id)
      if (activePresetId.value === item.id) {
        activePresetId.value = ''
      }
      ElMessage({ message: `预设「${item.name}」已删除`, type: 'success' })
    } catch { }
  }

  onMounted(async () => {
    if (!presets.value.length) {
      presets.value = [{ id: defaultPresetId, name: '默认预设', snapshot: defaultSnapshot }]
    }
    const savedId = activePresetId.value
    if (savedId) {
      const preset = presets.value.find(p => p.id === savedId)
      if (preset) {
        applySnapshot(preset.snapshot)
      } else {
        activePresetId.value = ''
      }
    }
    await nextTick()
    presetReady.value = true
  })

  watch(
    () => [
      state.metaData.value,
      state.subPathSwitch.value,
      state.subPath.value,
      state.options.value,
      state.numData.value,
      state.openDelaySwitch.value,
      state.openDelay.value,
      state.isStepOpen.value,
      state.stepBatchSize.value,
      state.stepAutoAdvance.value,
      state.stepLoop.value,
      state.stepTrueLoop.value
    ],
    () => {
      if (presetReady.value && activePresetId.value && !isApplyingPreset.value) {
        activePresetId.value = ''
      }
    },
    { deep: true }
  )

  return {
    presets,
    activePresetId,
    presetNameInput,
    isApplyingPreset,
    presetReady,
    savePreset,
    applyPreset,
    deletePreset
  }
}