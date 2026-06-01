import { ref, computed, watch } from 'vue'

function generateUrlCode() {
  return `(function(){function f(k){var r=[];if(k.indexOf('placeholder:')===0)return document.querySelectorAll('[placeholder="'+k.slice(12).replace(/["\\\\]/g,'')+'"]');if(k.indexOf('sel:')===0)return document.querySelectorAll(k.slice(4));k=k.replace(/["\\\\]/g,'');document.querySelectorAll('[name="'+k+'"]').forEach(function(e){r.push(e)});document.querySelectorAll('[id="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[placeholder="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[aria-label="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[type="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});var l=document.querySelectorAll('label');for(var i=0;i<l.length;i++){if(l[i].textContent.indexOf(k)!==-1){var a=l[i].getAttribute('for');if(a){document.querySelectorAll('[id="'+a+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}else{l[i].querySelectorAll('input,textarea,select').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}}}return r}try{var p=new URLSearchParams(location.search),n=p.size;if(!n)return;p.forEach(function(v,k){f(k).forEach(function(e){var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})})}catch(e){}})()`
}

function generateCustomCode(params) {
  var json = JSON.stringify(params)
  return `(function(){function f(k){var r=[];if(k.indexOf('placeholder:')===0)return document.querySelectorAll('[placeholder="'+k.slice(12).replace(/["\\\\]/g,'')+'"]');if(k.indexOf('sel:')===0)return document.querySelectorAll(k.slice(4));k=k.replace(/["\\\\]/g,'');document.querySelectorAll('[name="'+k+'"]').forEach(function(e){r.push(e)});document.querySelectorAll('[id="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[placeholder="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[aria-label="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[type="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});var l=document.querySelectorAll('label');for(var i=0;i<l.length;i++){if(l[i].textContent.indexOf(k)!==-1){var a=l[i].getAttribute('for');if(a){document.querySelectorAll('[id="'+a+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}else{l[i].querySelectorAll('input,textarea,select').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}}}return r}try{var p=${json};Object.keys(p).forEach(function(k){var v=p[k];f(k).forEach(function(e){var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})})}catch(e){}})()`
}

function generateFileCode() {
  return `(function(){var d=document;function f(k){var r=[];if(k.indexOf('placeholder:')===0)return d.querySelectorAll('[placeholder="'+k.slice(12).replace(/["\\\\]/g,'')+'"]');if(k.indexOf('sel:')===0)return d.querySelectorAll(k.slice(4));k=k.replace(/["\\\\]/g,'');d.querySelectorAll('[name="'+k+'"]').forEach(function(e){r.push(e)});d.querySelectorAll('[id="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});d.querySelectorAll('[placeholder="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});d.querySelectorAll('[aria-label="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});d.querySelectorAll('[type="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});var l=d.querySelectorAll('label');for(var i=0;i<l.length;i++){if(l[i].textContent.indexOf(k)!==-1){var a=l[i].getAttribute('for');if(a){d.querySelectorAll('[id="'+a+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}else{l[i].querySelectorAll('input,textarea,select').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}}}return r}var i=d.createElement('input');i.type='file';i.accept='.json,text/plain';i.style.display='none';i.onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){try{var p=JSON.parse(ev.target.result);Object.keys(p).forEach(function(k){var v=p[k];f(k).forEach(function(el){var t=el.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('blur',{bubbles:true}))})})}catch(e){}};r.readAsText(f)};d.body.appendChild(i);i.click();setTimeout(function(){d.body.removeChild(i)},1e3)})()`
}

function generateFetchCode(host, port) {
  var escapedHost = host.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
  var escapedPort = port.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
  return `(function(){var h='${escapedHost}',p='${escapedPort}';function f(k){var r=[];if(k.indexOf('placeholder:')===0)return document.querySelectorAll('[placeholder="'+k.slice(12).replace(/["\\\\]/g,'')+'"]');if(k.indexOf('sel:')===0)return document.querySelectorAll(k.slice(4));k=k.replace(/["\\\\]/g,'');document.querySelectorAll('[name="'+k+'"]').forEach(function(e){r.push(e)});document.querySelectorAll('[id="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[placeholder="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[aria-label="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});document.querySelectorAll('[type="'+k+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)});var l=document.querySelectorAll('label');for(var i=0;i<l.length;i++){if(l[i].textContent.indexOf(k)!==-1){var a=l[i].getAttribute('for');if(a){document.querySelectorAll('[id="'+a+'"]').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}else{l[i].querySelectorAll('input,textarea,select').forEach(function(e){if(r.indexOf(e)===-1)r.push(e)})}}}return r}try{fetch('http://'+h+':'+p+'/api/generate').then(function(r){return r.json()}).then(function(p){Object.keys(p).forEach(function(k){var v=p[k];f(k).forEach(function(e){var t=e.tagName.toLowerCase();if(t==='input'||t==='textarea'||t==='select')e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('blur',{bubbles:true}))})})}).catch(function(){})}catch(e){}})()`
}

export function useBookmarklet() {
  const savedMode = localStorage.getItem('fast_bookmarklet_mode')
  const mode = ref(savedMode === 'url' || savedMode === 'custom' || savedMode === 'file' || savedMode === 'remote' ? savedMode : 'url')

  const savedParams = localStorage.getItem('fast_bookmarklet_params')
  const customParamsRaw = ref(savedParams || '')

  const savedHost = localStorage.getItem('fast_bookmarklet_remote_host')
  const savedPort = localStorage.getItem('fast_bookmarklet_remote_port')
  const remoteHost = ref(savedHost || 'localhost')
  const remotePort = ref(savedPort || '8080')
  const remoteStatus = ref('idle')
  let healthCheckTimer = null

  watch(mode, (val) => {
    localStorage.setItem('fast_bookmarklet_mode', val)
  })

  watch(customParamsRaw, (val) => {
    localStorage.setItem('fast_bookmarklet_params', val)
  })

  watch(remoteHost, () => {
    localStorage.setItem('fast_bookmarklet_remote_host', remoteHost.value)
    debouncedHealthCheck()
  })

  watch(remotePort, () => {
    localStorage.setItem('fast_bookmarklet_remote_port', remotePort.value)
    debouncedHealthCheck()
  })

  function debouncedHealthCheck() {
    if (healthCheckTimer) clearTimeout(healthCheckTimer)
    if (!remoteHost.value.trim() || !remotePort.value.trim()) {
      remoteStatus.value = 'idle'
      return
    }
    remoteStatus.value = 'checking'
    healthCheckTimer = setTimeout(doHealthCheck, 500)
  }

  async function doHealthCheck() {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const response = await fetch(`http://${remoteHost.value.trim()}:${remotePort.value.trim()}/api/latest`, {
        signal: controller.signal
      })
      clearTimeout(timeout)
      remoteStatus.value = response.ok ? 'valid' : 'invalid'
    } catch {
      remoteStatus.value = 'invalid'
    }
  }

  if (remoteHost.value && remotePort.value) {
    setTimeout(() => {
      remoteStatus.value = 'checking'
      doHealthCheck()
    }, 100)
  }

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
      if (!remoteHost.value.trim() || !remotePort.value.trim()) return ''
      return generateFetchCode(remoteHost.value.trim(), remotePort.value.trim())
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

  return { jsCode, mode, customParamsRaw, jsonValid, remoteHost, remotePort, remoteStatus, checkRemoteHealth: doHealthCheck }
}