import { useSubPath } from '../composables/useSubPath'
import { useLinks } from '../composables/useLinks'
import { useStepNav } from '../composables/useStepNav'
import { useOpenLink } from '../composables/useOpenLink'
import { usePreset } from '../composables/usePreset'
import { useGlobalExport } from '../composables/useGlobalExport'
import { useStyle } from '../composables/useStyle'
import { useEmailGen } from '../composables/useEmailGen'
import { useDark } from '@vueuse/core'

// 模块级单例：首页与工具箱页共享同一份核心状态，
// 任意页面修改（如应用预设、生成邮箱）都会在另一页面生效。
const subPath = useSubPath()
const links = useLinks(subPath.subPath, subPath.subPathSwitch, subPath.selectedQueryIds, subPath.queryOptions)
const stepNav = useStepNav(links.processedUrlList, links.linkList)
const openLink = useOpenLink({
  processedUrlList: links.processedUrlList,
  isStepOpen: stepNav.isStepOpen,
  stepBatchSize: stepNav.stepBatchSize,
  stepLoop: stepNav.stepLoop,
  stepTrueLoop: stepNav.stepTrueLoop,
  stepIndex: stepNav.stepIndex,
  stepAutoAdvance: stepNav.stepAutoAdvance,
  markOpened: stepNav.markOpened,
  advanceIndex: stepNav.advanceIndex,
})
const preset = usePreset({
  metaData: links.metaData,
  subPathSwitch: subPath.subPathSwitch,
  subPath: subPath.subPath,
  numData: openLink.numData,
  openDelaySwitch: openLink.openDelaySwitch,
  openDelay: openLink.openDelay,
  openDelayMax: openLink.openDelayMax,
  openDelayRandom: openLink.openDelayRandom,
  isStepOpen: stepNav.isStepOpen,
  stepBatchSize: stepNav.stepBatchSize,
  stepAutoAdvance: stepNav.stepAutoAdvance,
  stepLoop: stepNav.stepLoop,
  stepTrueLoop: stepNav.stepTrueLoop,
  stepOpened: stepNav.stepOpened,
  stepIndex: stepNav.stepIndex,
  queryOptions: subPath.queryOptions,
  selectedQueryIds: subPath.selectedQueryIds,
})
const emailGen = useEmailGen()
const style = useStyle()
const isDark = useDark()

// 启动时恢复上次激活的预设
preset.initPreset()

// 全局导入导出（注册桥接供 ThemePanel 读取）
useGlobalExport({
  metaData: links.metaData,
  subPathSwitch: subPath.subPathSwitch,
  subPath: subPath.subPath,
  options: subPath.options,
  queryOptions: subPath.queryOptions,
  selectedQueryIds: subPath.selectedQueryIds,
  numData: openLink.numData,
  openDelaySwitch: openLink.openDelaySwitch,
  openDelay: openLink.openDelay,
  openDelayMax: openLink.openDelayMax,
  openDelayRandom: openLink.openDelayRandom,
  isStepOpen: stepNav.isStepOpen,
  stepBatchSize: stepNav.stepBatchSize,
  stepAutoAdvance: stepNav.stepAutoAdvance,
  stepLoop: stepNav.stepLoop,
  stepTrueLoop: stepNav.stepTrueLoop,
  presets: preset.presets,
  activePresetId: preset.activePresetId,
  darkMode: isDark,
  styleKey: style.currentStyle
})

export const coreState = {
  subPath,
  links,
  stepNav,
  openLink,
  preset,
  emailGen,
  style,
  isDark
}
