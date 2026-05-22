import { ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export function useStepNav(processedUrlList, linkList) {
  const isStepOpen = useStorage('fast_isStepOpen', false)
  const stepIndex = ref(0)
  const stepBatchSize = useStorage('fast_stepBatchSize', 1)
  const stepAutoAdvance = useStorage('fast_stepAutoAdvance', true)
  const stepLoop = useStorage('fast_stepLoop', false)
  const stepTrueLoop = useStorage('fast_stepTrueLoop', true)
  const stepOpened = useStorage('fast_stepOpened', [])

  const useWrap = computed(() => stepTrueLoop.value)

  const batchLinks = computed(() => {
    if (!processedUrlList.value.length) return []
    const result = []
    const total = processedUrlList.value.length
    for (let i = 0; i < stepBatchSize.value; i++) {
      const idx = useWrap.value ? (stepIndex.value + i) % total : stepIndex.value + i
      if (idx >= total) break
      if (result.some(item => item.index === idx)) break
      result.push({ index: idx, url: processedUrlList.value[idx] })
    }
    return result
  })

  const tagStatus = computed(() => {
    if (!processedUrlList.value.length) return []
    const total = processedUrlList.value.length
    const batchSet = new Set()
    for (let j = 0; j < stepBatchSize.value; j++) {
      const idx = useWrap.value ? (stepIndex.value + j) % total : stepIndex.value + j
      if (idx >= total) break
      batchSet.add(idx)
    }
    return linkList.value.map((_, i) => ({
      type: batchSet.has(i) ? '' : (stepOpened.value.includes(i) ? 'success' : 'info'),
      effect: batchSet.has(i) ? 'dark' : 'plain',
      active: batchSet.has(i)
    }))
  })

  const markOpened = (idx) => {
    if (!stepOpened.value.includes(idx)) {
      stepOpened.value = [...stepOpened.value, idx]
    }
  }

  const advanceIndex = (step) => {
    if (stepTrueLoop.value) {
      stepIndex.value = (stepIndex.value + step) % (linkList.value.length || 1)
    } else if (stepLoop.value) {
      let next = stepIndex.value + step
      if (next >= linkList.value.length) {
        next = 0
      }
      stepIndex.value = next
    } else {
      stepIndex.value = Math.min(stepIndex.value + step, linkList.value.length - 1)
    }
  }

  const onStepClick = (i) => {
    stepIndex.value = i
  }

  const onStepPrev = () => {
    const step = stepBatchSize.value
    const total = linkList.value.length
    if (stepTrueLoop.value) {
      stepIndex.value = (stepIndex.value - step + total) % total
    } else if (stepLoop.value) {
      let next = stepIndex.value - step
      if (next < 0) next = total - (total % step || step)
      stepIndex.value = next
    } else {
      stepIndex.value = Math.max(0, stepIndex.value - step)
    }
  }

  const onStepNext = () => {
    const step = stepBatchSize.value
    const total = linkList.value.length
    if (stepTrueLoop.value) {
      stepIndex.value = (stepIndex.value + step) % total
    } else if (stepLoop.value) {
      let next = stepIndex.value + step
      if (next >= total) next = 0
      stepIndex.value = next
    } else {
      stepIndex.value = Math.min(total - 1, stepIndex.value + step)
    }
  }

  watch(stepLoop, (val) => {
    if (val) stepTrueLoop.value = false
  })
  watch(stepTrueLoop, (val) => {
    if (val) stepLoop.value = false
  })

  const resetOpened = () => {
    stepOpened.value = []
  }

  return {
    isStepOpen,
    stepIndex,
    stepBatchSize,
    stepAutoAdvance,
    stepLoop,
    stepTrueLoop,
    stepOpened,
    batchLinks,
    tagStatus,
    markOpened,
    advanceIndex,
    resetOpened,
    onStepClick,
    onStepPrev,
    onStepNext
  }
}