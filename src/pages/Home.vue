<template>
    <PresetBar
        :presets="presets"
        :active-preset-id="activePresetId"
        :preset-name-input="presetNameInput"
        :is-applying-preset="isApplyingPreset"
        @apply-preset="applyPreset"
        @delete-preset="deletePreset"
        @update-preset-content="updatePresetContent"
        @reorder-presets="reorderPresets"
        @update:preset-name-input="presetNameInput = $event"
        @save-preset="savePreset"
    />
    <el-input
        v-model="metaData"
        :autosize="{ minRows: 10, maxRows: 36 }"
        type="textarea"
        placeholder="Please input links"
        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
        class="input"
    />
    <!-- 去重警告 -->
    <el-alert
        v-if="hasDuplicates"
        title="检测到重复链接（已忽略协议和末尾斜杠）"
        type="warning"
        :closable="false"
        show-icon
        class="dup_alert"
    />
    <!-- 撤销清空 -->
    <div v-if="clearedBackup != null" class="undo_bar">
        <span>已清空链接列表</span>
        <el-button size="small" text type="primary" @click="undoClear">撤销</el-button>
    </div>
    <SubPathPanel
        :sub-path-switch="subPathSwitch"
        :sub-path="subPath"
        :query-options="queryOptions"
        :selected-query-ids="selectedQueryIds"
        :options="options"
        @update:sub-path-switch="subPathSwitch = $event"
        @update:sub-path="subPath = $event ?? ''"
        @add-custom-path="addCustomPath"
        @remove-custom-path="removeCustomPath"
        @update-custom-path="updateCustomPath"
        @reorder-paths="reorderPaths"
        @add-query-option="addQueryOption"
        @remove-query-option="removeQueryOption"
        @update-query-option="updateQueryOption"
        @reorder-query-options="reorderQueryOptions"
        @toggle-query="toggleQuery"
    />
    <StepNavPanel
        :is-step-open="isStepOpen"
        :link-list="linkList"
        :tag-status="tagStatus"
        :batch-links="batchLinks"
        :step-index="stepIndex"
        :has-links="hasLinks"
        :step-batch-size="stepBatchSize"
        :step-auto-advance="stepAutoAdvance"
        :step-loop="stepLoop"
        :step-true-loop="stepTrueLoop"
        @update:is-step-open="isStepOpen = $event"
        @update:step-batch-size="stepBatchSize = $event"
        @update:step-auto-advance="stepAutoAdvance = $event"
        @update:step-loop="stepLoop = $event"
        @update:step-true-loop="stepTrueLoop = $event"
        @step-click="onStepClick"
        @step-prev="onStepPrev"
        @step-next="onStepNext"
        @reset-opened="resetOpened"
    />
    <ConfigBar
        :num-data="numData"
        :open-delay-switch="openDelaySwitch"
        :open-delay="openDelay"
        :open-delay-max="openDelayMax"
        :open-delay-random="openDelayRandom"
        :has-links="hasLinks"
        :processed-url-list="processedUrlList"
        @update:num-data="numData = $event"
        @update:open-delay-switch="openDelaySwitch = $event"
        @update:open-delay="openDelay = $event"
        @update:open-delay-max="openDelayMax = $event"
        @update:open-delay-random="openDelayRandom = $event"
    />
    <ActionBar
        :has-links="hasLinks"
        :is-step-open="isStepOpen"
        :step-batch-size="stepBatchSize"
        :num-data="numData"
        :link-list-len="linkList.length"
        @open-link="openLink"
        @clear="clear"
    />
</template>

<script setup>
import { useSubPath } from '../composables/useSubPath'
import { useLinks } from '../composables/useLinks'
import { useStepNav } from '../composables/useStepNav'
import { useOpenLink } from '../composables/useOpenLink'
import { usePreset } from '../composables/usePreset'
import { useGlobalExport } from '../composables/useGlobalExport'
import { useStyle } from '../composables/useStyle'
import useDarkStore from '../stores/darkStore'
import { onKeyStroke, useDark } from '@vueuse/core'
import PresetBar from '../components/PresetBar.vue'
import SubPathPanel from '../components/SubPathPanel.vue'
import StepNavPanel from '../components/StepNavPanel.vue'
import ConfigBar from '../components/ConfigBar.vue'
import ActionBar from '../components/ActionBar.vue'

const {
  subPathSwitch,
  subPath,
  queryOptions,
  selectedQueryIds,
  options,
  pathId,
  addCustomPath,
  removeCustomPath,
  updateCustomPath,
  reorderPaths,
  addQueryOption,
  removeQueryOption,
  updateQueryOption,
  reorderQueryOptions,
  toggleQuery
} = useSubPath()

const {
  metaData,
  linkList,
  hasLinks,
  processedUrlList,
  duplicateLines,
  hasDuplicates,
  clear,
  undoClear,
  clearedBackup
} = useLinks(subPath, subPathSwitch, selectedQueryIds, queryOptions)

const {
  isStepOpen,
  stepIndex,
  stepBatchSize,
  stepAutoAdvance,
  stepLoop,
  stepTrueLoop,
  stepOpened,
  batchLinks,
  tagStatus,
  markOpened,
  advanceIndex,
  resetOpened,
  onStepClick,
  onStepPrev,
  onStepNext
} = useStepNav(processedUrlList, linkList)

const {
  numData,
  openDelaySwitch,
  openDelay,
  openDelayMax,
  openDelayRandom,
  openLink
} = useOpenLink({
  processedUrlList,
  isStepOpen,
  stepBatchSize,
  stepLoop,
  stepTrueLoop,
  stepIndex,
  stepAutoAdvance,
  markOpened,
  advanceIndex,
})

const {
  presets,
  activePresetId,
  presetNameInput,
  isApplyingPreset,
  savePreset,
  applyPreset,
  deletePreset,
  renamePreset,
  updatePresetContent,
  reorderPresets
} = usePreset({
  metaData,
  subPathSwitch,
  subPath,
  numData,
  openDelaySwitch,
  openDelay,
  openDelayMax,
  openDelayRandom,
  isStepOpen,
  stepBatchSize,
  stepAutoAdvance,
  stepLoop,
  stepTrueLoop,
  stepOpened,
  stepIndex,
  queryOptions,
  selectedQueryIds,
})

// 全局导入导出
const darkStore = useDarkStore()
const { currentStyle: styleKey } = useStyle()
const isDark = useDark()
const { exportAll, importAll } = useGlobalExport({
  metaData,
  subPathSwitch,
  subPath,
  options,
  queryOptions,
  selectedQueryIds,
  numData,
  openDelaySwitch,
  openDelay,
  openDelayMax,
  openDelayRandom,
  isStepOpen,
  stepBatchSize,
  stepAutoAdvance,
  stepLoop,
  stepTrueLoop,
  presets,
  activePresetId,
  darkMode: isDark,
  styleKey
})

onKeyStroke('Enter', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (hasLinks.value) {
      openLink()
    }
  }
})

onKeyStroke('ArrowLeft', () => {
  if (isStepOpen.value && hasLinks.value) {
    const activeEl = document.activeElement
    if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') return
    onStepPrev()
  }
})

onKeyStroke('ArrowRight', () => {
  if (isStepOpen.value && hasLinks.value) {
    const activeEl = document.activeElement
    if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') return
    onStepNext()
  }
})
</script>

<style lang='scss' scoped>
.input{
    margin-bottom: 20px;
}
.dup_alert {
    margin-bottom: 20px;
}
.undo_bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    margin-bottom: 20px;
    border: 1px solid var(--el-color-primary-light-5);
    border-radius: 6px;
    background-color: color-mix(in srgb, var(--el-color-primary) 6%, transparent);
    font-size: 13px;
    color: var(--g-body-text-color);
}
</style>