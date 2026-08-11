import { useStorage } from '@vueuse/core'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function useOpenLink({
  processedUrlList,
  rawUrlList,
  isStepOpen,
  stepBatchSize,
  stepLoop,
  stepTrueLoop,
  stepIndex,
  stepAutoAdvance,
  markOpened,
  advanceIndex
}) {
  const numData = useStorage('fast_numData', 1)
  const openDelaySwitch = useStorage('fast_openDelaySwitch', false)
  const openDelay = useStorage('fast_openDelay', 500)
  const openDelayMax = useStorage('fast_openDelayMax', 1500)
  const openDelayRandom = useStorage('fast_openDelayRandom', false)
  const downloadMode = useStorage('fast_downloadMode', false)

  const downloadFile = async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('ERROR NETWORK')
      const blob = await response.blob()
      const downloadBlob = new Blob([blob], { type: 'application/octet-stream' })
      const blobUrl = URL.createObjectURL(downloadBlob)
      window.open(blobUrl)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch (error) {
      console.error('ERROR DOWNLOAD:', error)
    }
  }

  const getDelay = () => {
    if (openDelayRandom.value) {
      const min = openDelay.value
      const max = openDelayMax.value
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    return openDelay.value
  }

  const openStepBatch = async () => {
    const urlArr = processedUrlList.value
    if (!urlArr.length) return
    const bothOff = !stepLoop.value && !stepTrueLoop.value
    const max = bothOff ? Math.min(stepBatchSize.value, urlArr.length - stepIndex.value) : stepBatchSize.value
    const opened = new Set()
    for (let i = 0; i < max; i++) {
      const idx = stepTrueLoop.value ? (stepIndex.value + i) % urlArr.length : stepIndex.value + i
      if (idx >= urlArr.length) break
      if (opened.has(idx)) break
      opened.add(idx)
      for (let j = 0; j < numData.value; j++) {
        if (downloadMode.value) {
          await downloadFile(urlArr[idx])
        } else {
          window.open(urlArr[idx], '_blank')
        }
        if (openDelaySwitch.value) await sleep(getDelay())
      }
      markOpened(idx)
    }
    if (stepAutoAdvance.value) {
      advanceIndex(opened.size)
    }
  }

  const openAllFrom = async (urlArr) => {
    if (!urlArr.length) return
    for (const item of urlArr) {
      for (let i = 0; i < numData.value; i++) {
        if (downloadMode.value) {
          await downloadFile(item)
        } else {
          window.open(item, '_blank')
        }
        if (openDelaySwitch.value) await sleep(getDelay())
      }
    }
  }

  // 高级模式全部打开：使用处理后的链接（含子路径/查询参数）
  const openLink = async () => {
    if (isStepOpen.value) {
      await openStepBatch()
      return
    }
    await openAllFrom(processedUrlList.value)
  }

  // 简洁模式全部打开：使用原始链接（不受高级模式子路径/查询参数影响）
  const openAllRaw = async () => {
    const urlArr = (rawUrlList || processedUrlList).value
    await openAllFrom(urlArr)
  }

  return {
    numData,
    openDelaySwitch,
    openDelay,
    openDelayMax,
    openDelayRandom,
    downloadMode,
    openLink,
    openAllRaw
  }
}