<template>
    <div class="step_module">
        <div class="step_header">
            <span class="step_label">逐个打开</span>
            <el-switch
                :model-value="isStepOpen"
                @update:model-value="$emit('update:isStepOpen', $event)"
                inline-prompt
                style="--el-switch-on-color: var(--el-color-primary); --el-switch-off-color: #c9c9c9;"
                active-text="启用"
                inactive-text="禁用"
            />
        </div>
        <template v-if="isStepOpen">
            <div class="step_tags">
                <template v-if="hasLinks">
                    <el-tag
                        v-for="(link, i) in linkList"
                        :key="i"
                        :type="tagStatus[i]?.type || 'info'"
                        :effect="tagStatus[i]?.effect || 'plain'"
                        size="small"
                        class="step_tag"
                        :class="{ 'step_tag-active': tagStatus[i]?.active }"
                        @click="$emit('stepClick', i)"
                    >
                        {{ i + 1 }}
                    </el-tag>
                    <el-button size="small" text type="warning" class="step_reset_btn" @click="$emit('resetOpened')">
                        <el-icon style="font-size:13px"><RefreshLeft /></el-icon> 重置标记
                    </el-button>
                </template>
                <p v-else class="step_tags_empty">暂无有效链接</p>
            </div>
            <div class="step_url_box">
                <el-button :icon="ArrowLeft" :disabled="!hasLinks || (!stepLoop && !stepTrueLoop && stepIndex <= 0)" @click="$emit('stepPrev')" circle size="small" />
                <div class="step_url_text">
                    <div v-for="(item, j) in batchLinks" :key="j" class="step_url_item">{{ item.url }}</div>
                    <p v-if="!hasLinks" class="step_url_empty">暂无有效链接</p>
                </div>
                <el-button :icon="ArrowRight" :disabled="!hasLinks || (!stepLoop && !stepTrueLoop && stepIndex >= linkList.length - 1)" @click="$emit('stepNext')" circle size="small" />
            </div>
            <div class="step_controls">
                <div class="step_control">
                    <span class="step_control_label">每次打开</span>
                    <el-input-number :model-value="stepBatchSize" @update:model-value="$emit('update:stepBatchSize', $event)" :min="1" :max="linkList.length || 1" size="small" />
                    <span class="step_control_unit">个</span>
                </div>
                <div class="step_control">
                    <span class="step_control_label">自动推进</span>
                    <el-switch :model-value="stepAutoAdvance" @update:model-value="$emit('update:stepAutoAdvance', $event)" size="small" />
                </div>
                <div class="step_control">
                    <span class="step_control_label">到头重置</span>
                    <el-switch :model-value="stepLoop" @update:model-value="$emit('update:stepLoop', $event)" size="small" />
                </div>
                <div class="step_control">
                    <span class="step_control_label">连续循环</span>
                    <el-switch :model-value="stepTrueLoop" @update:model-value="$emit('update:stepTrueLoop', $event)" size="small" />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight, RefreshLeft } from '@element-plus/icons-vue'

defineProps({
    isStepOpen: { type: Boolean, default: false },
    linkList: { type: Array, default: () => [] },
    tagStatus: { type: Array, default: () => [] },
    batchLinks: { type: Array, default: () => [] },
    stepIndex: { type: Number, default: 0 },
    hasLinks: { type: Boolean, default: false },
    stepBatchSize: { type: Number, default: 1 },
    stepAutoAdvance: { type: Boolean, default: true },
    stepLoop: { type: Boolean, default: true },
    stepTrueLoop: { type: Boolean, default: false }
})

defineEmits([
    'update:isStepOpen',
    'update:stepBatchSize',
    'update:stepAutoAdvance',
    'update:stepLoop',
    'update:stepTrueLoop',
    'stepClick',
    'stepPrev',
    'stepNext',
    'resetOpened'
])
</script>

<style lang='scss' scoped>
.step_module {
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}
.step_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .step_label {
        font-style: normal;
        font-size: 15px;
        font-weight: 600;
    }
}
.step_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
}
.step_tag {
    cursor: pointer;
    font-size: 12px;
    &.step_tag-active {
        --el-tag-bg-color: var(--el-color-primary);
        --el-tag-text-color: #fff;
        --el-tag-border-color: var(--el-color-primary);
    }
    &.el-tag--info.el-tag--plain {
        --el-tag-bg-color: transparent;
        --el-tag-text-color: var(--g-body-text-color);
        --el-tag-border-color: var(--g-home-link-border);
    }
    &.el-tag--success.el-tag--plain {
        --el-tag-bg-color: transparent;
        --el-tag-text-color: var(--el-color-primary);
        --el-tag-border-color: var(--el-color-primary);
    }
}
.step_reset_btn {
    font-size: 12px;
    padding: 0 8px;
    height: 22px;
    margin-left: 2px;
    color: var(--el-color-warning);
    &:hover {
        background-color: rgba(230, 162, 60, 0.12) !important;
        border-color: rgba(230, 162, 60, 0.3) !important;
        color: var(--el-color-warning) !important;
    }
}
.step_tags_empty {
    font-style: normal;
    font-size: 13px;
    color: var(--g-body-text-color);
    opacity: 0.4;
    margin: 0;
}
.step_url_box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding: 10px 14px;
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    .step_url_text {
        flex: 1;
        font-size: 13px;
        color: var(--g-body-text-color);
        line-height: 1.4;
        overflow: hidden;
    }
    .step_url_item {
        padding: 1px 0;
        word-break: break-all;
    }
    .step_url_item + .step_url_item {
        border-top: 1px solid var(--g-home-link-border);
        padding-top: 3px;
        margin-top: 3px;
    }
    .step_url_empty {
        font-style: normal;
        font-size: 13px;
        color: var(--g-body-text-color);
        opacity: 0.4;
        margin: 0;
    }
}
@media (max-width: 640px) {
    .step_url_box {
        padding: 8px 10px;
        gap: 6px;
    }
    .step_controls {
        gap: 10px;
    }
}
.step_controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 14px;
    .step_control {
        display: flex;
        align-items: center;
        gap: 6px;
        .step_control_label,
        .step_control_unit {
            font-style: normal;
            font-size: 13px;
        }
    }
}
</style>