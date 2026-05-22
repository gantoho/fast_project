import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { buildUrl } from '../utils/buildUrl'

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

  const processedUrlList = computed(() => {
    return linkList.value.map(item => buildUrl(item, subPathSwitchRef.value, subPathRef.value))
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