import { ref, computed, watch } from 'vue'

function generateUrlCode() {
  return `(function(){try{var p=new URLSearchParams(location.search),n=p.size;if(!n)return;p.forEach(function(v,k){var s=k.replace(/["\\\\]/g,'');document.querySelectorAll('[name="'+s+'"], [id="'+s+'"]').forEach(function(e){var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})})}catch(e){}})()`
}

function generateCustomCode(params) {
  var json = JSON.stringify(params)
  return `(function(){try{var p=${json};Object.keys(p).forEach(function(k){var v=p[k];var s=k.replace(/["\\\\]/g,'');document.querySelectorAll('[name="'+s+'"], [id="'+s+'"]').forEach(function(e){var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})})}catch(e){}})()`
}

function generateFileCode() {
  return `(function(){var d=document,i=d.createElement('input');i.type='file';i.accept='.json,text/plain';i.style.display='none';i.onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){try{var p=JSON.parse(ev.target.result);Object.keys(p).forEach(function(k){var v=p[k];var s=k.replace(/["\\\\]/g,'');d.querySelectorAll('[name="'+s+'"], [id="'+s+'"]').forEach(function(el){var t=el.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('blur',{bubbles:true}))})})}catch(e){}};r.readAsText(f)};d.body.appendChild(i);i.click();setTimeout(function(){d.body.removeChild(i)},1e3)})()`
}

function generateFetchCode(url) {
  var escapedUrl = url.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `(function(){try{fetch('${escapedUrl}').then(function(r){return r.json()}).then(function(p){Object.keys(p).forEach(function(k){var v=p[k];var s=k.replace(/["\\\\]/g,'');document.querySelectorAll('[name="'+s+'"], [id="'+s+'"]').forEach(function(e){var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})})}).catch(function(){})}catch(e){}})()`
}

export function useBookmarklet() {
  const savedMode = localStorage.getItem('fast_bookmarklet_mode')
  const mode = ref(savedMode === 'url' || savedMode === 'custom' || savedMode === 'file' || savedMode === 'remote' ? savedMode : 'url')

  const savedParams = localStorage.getItem('fast_bookmarklet_params')
  const customParamsRaw = ref(savedParams || '')

  const savedUrl = localStorage.getItem('fast_bookmarklet_remote_url')
  const remoteUrl = ref(savedUrl || '')

  watch(mode, (val) => {
    localStorage.setItem('fast_bookmarklet_mode', val)
  })

  watch(customParamsRaw, (val) => {
    localStorage.setItem('fast_bookmarklet_params', val)
  })

  watch(remoteUrl, (val) => {
    localStorage.setItem('fast_bookmarklet_remote_url', val)
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
    if (mode.value === 'file') {
      return generateFileCode()
    }
    if (mode.value === 'remote') {
      if (!remoteUrl.value.trim()) return ''
      return generateFetchCode(remoteUrl.value.trim())
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

  const remoteUrlValid = computed(() => {
    if (mode.value !== 'remote') return true
    if (!remoteUrl.value.trim()) return false
    try {
      new URL(remoteUrl.value.trim())
      return true
    } catch {
      return false
    }
  })

  return { jsCode, mode, customParamsRaw, jsonValid, remoteUrl, remoteUrlValid }
}