import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

function sha1(str) {
  const bytes = new TextEncoder().encode(str)
  const blockSize = 64
  const h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]

  const padded = new Uint8Array(blockSize * Math.ceil((bytes.length + 9) / blockSize))
  padded.set(bytes)
  padded[bytes.length] = 0x80

  let bitLength = BigInt(bytes.length * 8)
  const lengthBytes = new Uint8Array(8)
  for (let i = 7; i >= 0; i--) {
    lengthBytes[i] = Number(bitLength & BigInt(0xff))
    bitLength >>= BigInt(8)
  }
  padded.set(lengthBytes, padded.length - 8)

  for (let i = 0; i < padded.length; i += blockSize) {
    const w = new Uint32Array(80)
    for (let j = 0; j < 16; j++) {
      w[j] = (padded[i + j * 4] << 24) | (padded[i + j * 4 + 1] << 16) | (padded[i + j * 4 + 2] << 8) | padded[i + j * 4 + 3]
    }
    for (let j = 16; j < 80; j++) {
      w[j] = (w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]) >>> 0
      w[j] = (w[j] << 1) | ((w[j] >>> 31) & 1)
    }

    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4]

    for (let j = 0; j < 80; j++) {
      let f, k
      if (j < 20) {
        f = (b & c) | (~b & d)
        k = 0x5A827999
      } else if (j < 40) {
        f = b ^ c ^ d
        k = 0x6ED9EBA1
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d)
        k = 0x8F1BBCDC
      } else {
        f = b ^ c ^ d
        k = 0xCA62C1D6
      }

      const temp = (((a << 5) | ((a >>> 27) & 31)) + f + e + k + w[j]) >>> 0
      e = d
      d = c
      c = ((b << 30) | ((b >>> 2) & 0x3FFFFFFF)) >>> 0
      b = a
      a = temp
    }

    h[0] = (h[0] + a) >>> 0
    h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0
  }

  let hex = ''
  for (const num of h) {
    hex += num.toString(16).padStart(8, '0')
  }
  return hex
}

export function useEmailGen() {
  const emailSwitch = useStorage('fast_emailSwitch', false)
  const emailMode = useStorage('fast_emailMode', 'sha1')
  const emailPrefix = useStorage('fast_emailPrefix', 'testbit')
  const emailStart = useStorage('fast_emailStart', 1)
  const emailEnd = useStorage('fast_emailEnd', 10)
  const emailStep = useStorage('fast_emailStep', 1)
  const emailZeroPad = useStorage('fast_emailZeroPad', 0)
  const emailCount = useStorage('fast_emailCount', 1)
  const emailSuffix = useStorage('fast_emailSuffix', '__custom__')
  const emailSuffixOptions = useStorage('fast_emailSuffixOptions', [
    { id: '0', label: 'Gmail', value: '@gmail.com' },
    { id: '1', label: 'Outlook', value: '@outlook.com' },
    { id: '2', label: 'QQ', value: '@qq.com' },
    { id: '3', label: '163', value: '@163.com' },
    { id: '4', label: '126', value: '@126.com' },
    { id: '5', label: 'Hotmail', value: '@hotmail.com' },
    { id: '6', label: 'Yahoo', value: '@yahoo.com' },
    { id: '7', label: 'iCloud', value: '@icloud.com' },
  ])
  const sha1Length = useStorage('fast_sha1Length', 7)
  const englishLength = useStorage('fast_englishLength', 10)
  const emailCase = useStorage('fast_emailCase', 'mixed')
  const customSuffix = useStorage('fast_customSuffix', '@canglankeji.com')

  const emailList = ref([])

  const getSuffix = () => emailSuffix.value === '__custom__' ? (customSuffix.value || '') : (emailSuffix.value || '')

  const generateRange = () => {
    const prefix = emailPrefix.value || ''
    const start = parseInt(emailStart.value) || 1
    const end = parseInt(emailEnd.value) || 1
    const step = parseInt(emailStep.value) || 1
    const pad = parseInt(emailZeroPad.value) || 0
    const suffix = getSuffix()

    const result = []
    if (step > 0 && start <= end) {
      for (let i = start; i <= end; i += step) {
        const numStr = pad > 0 ? String(i).padStart(pad, '0') : String(i)
        result.push(prefix + numStr + suffix)
      }
    } else if (step < 0 && start >= end) {
      for (let i = start; i >= end; i += step) {
        const numStr = pad > 0 ? String(i).padStart(pad, '0') : String(i)
        result.push(prefix + numStr + suffix)
      }
    }
    return result
  }

  const generateTime = () => {
    const prefix = emailPrefix.value || ''
    const count = parseInt(emailCount.value) || 1
    const suffix = getSuffix()
    const result = []

    for (let i = 0; i < count; i++) {
      const date = new Date(Date.now() + i * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      result.push(prefix + year + month + day + hour + minute + second + suffix)
    }
    return result
  }

  const generateTimestamp = () => {
    const prefix = emailPrefix.value || ''
    const count = parseInt(emailCount.value) || 1
    const suffix = getSuffix()
    const result = []

    for (let i = 0; i < count; i++) {
      result.push(prefix + (Date.now() + i * 1000) + suffix)
    }
    return result
  }

  const generateSha1 = () => {
    const prefix = emailPrefix.value || ''
    const count = parseInt(emailCount.value) || 1
    const suffix = getSuffix()
    const len = parseInt(sha1Length.value) || 40
    const result = []
    const seed = Date.now().toString()

    for (let i = 0; i < count; i++) {
      const hash = sha1(prefix + seed + i)
      const truncated = len >= hash.length ? hash : hash.slice(0, len)
      result.push(prefix + truncated + suffix)
    }
    return result
  }

  const generateEnglish = () => {
    const prefix = emailPrefix.value || ''
    const count = parseInt(emailCount.value) || 1
    const suffix = getSuffix()
    const len = parseInt(englishLength.value) || 10
    const result = []
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const mixed = lower + upper

    const chars = emailCase.value === 'upper' ? upper : emailCase.value === 'lower' ? lower : mixed

    for (let i = 0; i < count; i++) {
      let str = ''
      for (let j = 0; j < len; j++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      result.push(prefix + str + suffix)
    }
    return result
  }

  const generate = () => {
    if (!emailSwitch.value) {
      emailList.value = []
      return
    }

    switch (emailMode.value) {
      case 'range':
        emailList.value = generateRange()
        break
      case 'time':
        emailList.value = generateTime()
        break
      case 'timestamp':
        emailList.value = generateTimestamp()
        break
      case 'sha1':
        emailList.value = generateSha1()
        break
      case 'english':
        emailList.value = generateEnglish()
        break
      default:
        emailList.value = []
    }
  }

  watch(
    [emailSwitch, emailMode, emailPrefix, emailStart, emailEnd, emailStep, emailZeroPad, emailSuffix],
    () => {
      if (emailMode.value === 'range') {
        generate()
      }
    },
    { immediate: true }
  )

  const addSuffixOption = (label, value) => {
    if (!label || !value) return
    if (emailSuffixOptions.value.some(item => item.value === value)) return
    const maxId = Math.max(0, ...emailSuffixOptions.value.map(o => parseInt(o.id) || 0))
    emailSuffixOptions.value.push({ id: String(maxId + 1), label, value })
  }

  const removeSuffixOption = (id) => {
    emailSuffixOptions.value = emailSuffixOptions.value.filter(o => o.id !== id)
  }

  return {
    emailSwitch,
    emailMode,
    emailPrefix,
    emailStart,
    emailEnd,
    emailStep,
    emailZeroPad,
    emailCount,
    emailSuffix,
    customSuffix,
    emailSuffixOptions,
    sha1Length,
    englishLength,
    emailCase,
    emailList,
    generate,
    addSuffixOption,
    removeSuffixOption
  }
}