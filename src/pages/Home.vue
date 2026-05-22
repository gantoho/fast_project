<template>
    <PresetBar
        :presets="presets"
        :active-preset-id="activePresetId"
        @apply-preset="applyPreset"
        @delete-preset="deletePreset"
        @update-preset-content="updatePresetContent"
        @reorder-presets="reorderPresets"
    />
    <el-input
        v-model="metaData"
        :autosize="{ minRows: 10, maxRows: 36 }"
        type="textarea"
        placeholder="Please input links"
        :input-style="{backgroundColor: 'rgba(0,0,0,0)', color: 'var(--g-body-text-color)'}"
        class="input"
    />
    <SubPathPanel
        :sub-path-switch="subPathSwitch"
        :sub-path="subPath"
        :options="options"
        @update:sub-path-switch="subPathSwitch = $event"
        @update:sub-path="subPath = $event ?? ''"
        @add-custom-path="addCustomPath"
        @remove-custom-path="removeCustomPath"
        @update-custom-path="updateCustomPath"
        @reorder-paths="reorderPaths"
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
        :preset-name-input="presetNameInput"
        :is-applying-preset="isApplyingPreset"
        @update:num-data="numData = $event"
        @update:open-delay-switch="openDelaySwitch = $event"
        @update:open-delay="openDelay = $event"
        @update:preset-name-input="presetNameInput = $event"
        @save-preset="savePreset"
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
import { onKeyStroke } from '@vueuse/core'
import PresetBar from '../components/PresetBar.vue'
import SubPathPanel from '../components/SubPathPanel.vue'
import StepNavPanel from '../components/StepNavPanel.vue'
import ConfigBar from '../components/ConfigBar.vue'
import ActionBar from '../components/ActionBar.vue'

const {
  subPathSwitch,
  subPath,
  options,
  pathId,
  addCustomPath,
  removeCustomPath,
  updateCustomPath,
  reorderPaths
} = useSubPath()

const {
  metaData,
  linkList,
  hasLinks,
  processedUrlList,
  clear
} = useLinks(subPath, subPathSwitch)

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
  openLink
} = useOpenLink({
  metaData,
  subPathSwitch,
  subPath,
  isStepOpen,
  stepBatchSize,
  stepLoop,
  stepTrueLoop,
  stepIndex,
  stepAutoAdvance,
  linkList,
  markOpened,
  advanceIndex
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
  isStepOpen,
  stepBatchSize,
  stepAutoAdvance,
  stepLoop,
  stepTrueLoop,
  stepOpened,
  stepIndex
})

onKeyStroke('Enter', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (hasLinks.value) {
      openLink()
    }
  }
})
</script>

<style lang='scss' scoped>
.input{
    margin-bottom: 20px;
}
</style>