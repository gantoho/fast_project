import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { buildUrl } from '../utils/buildUrl'

export function useLinks(subPathRef, subPathSwitchRef, selectedQueryIdsRef, queryOptionsRef) {
  const metaData = useStorage('fast_metaData', `https://zh-hans.react.dev/
https://svelte.dev/
https://cn.vuejs.org/
https://www.solidjs.com/
https://go.dev/
https://rust-lang.org`)

  const clearedBackup = ref(null)

  const linkList = computed(() => {
    return metaData.value.trim().split(/\r?\n/).filter(item => item.trim().length > 0)
  })

  const hasLinks = computed(() => linkList.value.length > 0)

  const processedUrlList = computed(() => {
    return linkList.value.map(item =>
      buildUrl(item, subPathSwitchRef.value, subPathRef.value, selectedQueryIdsRef?.value ?? [], queryOptionsRef?.value ?? [])
    )
  })

  // 去重检测
  const duplicateLines = computed(() => {
    const seen = new Map()
    const dups = new Set()
    linkList.value.forEach((line, i) => {
      const normalized = line.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '').toLowerCase()
      if (seen.has(normalized)) {
        dups.add(seen.get(normalized))
        dups.add(i)
      } else {
        seen.set(normalized, i)
      }
    })
    return [...dups].sort((a, b) => a - b)
  })

  const hasDuplicates = computed(() => duplicateLines.value.length > 0)

  const clear = () => {
    clearedBackup.value = metaData.value
    metaData.value = ''
  }

  const undoClear = () => {
    if (clearedBackup.value != null) {
      metaData.value = clearedBackup.value
      clearedBackup.value = null
    }
  }

  return {
    metaData,
    linkList,
    hasLinks,
    processedUrlList,
    duplicateLines,
    hasDuplicates,
    clear,
    undoClear,
    clearedBackup
  }
}