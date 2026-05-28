import { ref, computed, watch } from 'vue'

function generateUrlCode() {
  return `(function(){try{var p=new URLSearchParams(location.search),n=p.size;if(!n)return;p.forEach(function(v,k){var e=document.querySelector('[name="'+k.replace(/["\\\\]/g,'')+'"]')||document.getElementById(k);if(!e)return;var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})}catch(e){}})()`
}

function generateCustomCode(params) {
  var json = JSON.stringify(params)
  return `(function(){try{var p=${json};Object.keys(p).forEach(function(k){var v=p[k];var e=document.querySelector('[name="'+k.replace(/["\\\\]/g,'')+'"]')||document.getElementById(k);if(!e)return;var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})}catch(e){}})()`
}

export function useBookmarklet() {
  const savedMode = localStorage.getItem('fast_bookmarklet_mode')
  const mode = ref(savedMode === 'url' || savedMode === 'custom' ? savedMode : 'url')

  const savedParams = localStorage.getItem('fast_bookmarklet_params')
  const customParamsRaw = ref(savedParams || '')

  watch(mode, (val) => {
    localStorage.setItem('fast_bookmarklet_mode', val)
  })

  watch(customParamsRaw, (val) => {
    localStorage.setItem('fast_bookmarklet_params', val)
  })

  const jsCode = computed(() => {
    if (mode.value === 'custom') {
      try {
        var params = JSON.parse(customParamsRaw.value)
        if (Object.keys(params).length === 0) return generateUrlCode()
        return generateCustomCode(params)
      } catch {
        return ''
      }
    }
    return generateUrlCode()
  })

  const jsonValid = computed(() => {
    if (mode.value !== 'custom') return true
    if (!customParamsRaw.value.trim()) return true
    try {
      var params = JSON.parse(customParamsRaw.value)
      return typeof params === 'object' && params !== null && !Array.isArray(params)
    } catch {
      return false
    }
  })

  return { jsCode, mode, customParamsRaw, jsonValid }
}