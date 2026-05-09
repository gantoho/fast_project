import { useStorage } from '@vueuse/core'
import useDomain from './useDomain'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function useOpenLink({
  metaData,
  subPathSwitch,
  subPath,
  isStepOpen,
  stepBatchSize,
  stepLoop,
  stepTrueLoop,
  stepIndex,
  stepAutoAdvance,
  linkList,
  markOpened,
  advanceIndex
}) {
  const numData = useStorage('fast_numData', 1)
  const openDelaySwitch = useStorage('fast_openDelaySwitch', false)
  const openDelay = useStorage('fast_openDelay', 500)

  const openStepBatch = async () => {
    if (!linkList.value.length) return
    const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
    if (err) return
    const bothOff = !stepLoop.value && !stepTrueLoop.value
    const max = bothOff ? Math.min(stepBatchSize.value, urlArr.length - stepIndex.value) : stepBatchSize.value
    const opened = new Set()
    for (let i = 0; i < max; i++) {
      const idx = stepTrueLoop.value ? (stepIndex.value + i) % urlArr.length : stepIndex.value + i
      if (idx >= urlArr.length) break
      if (opened.has(idx)) break
      opened.add(idx)
      for (let j = 0; j < numData.value; j++) {
        window.open(urlArr[idx], '_blank')
        if (openDelaySwitch.value) await sleep(openDelay.value)
      }
      markOpened(idx)
    }
    if (stepAutoAdvance.value) {
      advanceIndex(opened.size)
    }
  }

  const openLink = async () => {
    if (isStepOpen.value) {
      await openStepBatch()
      return
    }
    const {urlArr, err} = useDomain(metaData, subPathSwitch, subPath)
    if (err != null) {
      console.error(err)
      return
    }
    for (const item of urlArr) {
      for (let i = 0; i < numData.value; i++) {
        window.open(item, '_blank')
        if (openDelaySwitch.value) await sleep(openDelay.value)
      }
    }
  }

  return {
    numData,
    openDelaySwitch,
    openDelay,
    openLink
  }
}