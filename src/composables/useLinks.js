import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export function useLinks(subPathRef, subPathSwitchRef) {
  const metaData = useStorage('fast_metaData', `https://zh-hans.react.dev/
https://svelte.dev/
https://cn.vuejs.org/
https://www.solidjs.com/
https://go.dev/
https://rust-lang.org`)

  const linkList = computed(() => {
    return metaData.value.trim().split(/\r?\n/).filter(item => item.trim().length > 0)
  })

  const hasLinks = computed(() => linkList.value.length > 0)

  const processUrl = (raw) => {
    const item = raw.trim()
    const currentSubPath = subPathRef.value ?? ''
    if (item.indexOf('http://') === 0 || item.indexOf('https://') === 0) {
      if (subPathSwitchRef.value && currentSubPath.trim().length > 0) {
        return (item.endsWith('/') ? item : item + '/') + currentSubPath.trim()
      }
      return item
    }
    if (subPathSwitchRef.value && currentSubPath.trim().length > 0) {
      return 'http://' + (item.endsWith('/') ? item : item + '/') + currentSubPath.trim()
    }
    return 'http://' + item
  }

  const processedUrlList = computed(() => {
    return linkList.value.map(item => processUrl(item))
  })

  const clear = () => {
    metaData.value = ''
  }

  return {
    metaData,
    linkList,
    hasLinks,
    processedUrlList,
    clear
  }
}