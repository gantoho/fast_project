<template>
    <div class="config_bar">
        <div class="config_group">
            <span class="config_label">打开次数</span>
            <el-input-number :model-value="numData" @update:model-value="$emit('update:numData', $event)" :min="1" :max="10" size="small" controls-position="right" />
            <span class="config_unit">次</span>
        </div>
        <span class="config_sep"></span>
        <div class="config_group">
            <span class="config_label">打开延迟</span>
            <el-switch :model-value="openDelaySwitch" @update:model-value="$emit('update:openDelaySwitch', $event)" size="small" />
            <template v-if="openDelaySwitch">
                <el-input-number :model-value="openDelay" @update:model-value="$emit('update:openDelay', $event)" :min="100" :max="30000" :step="100" size="small" controls-position="right" />
                <template v-if="openDelayRandom">
                    <span class="config_sep_text">~</span>
                    <el-input-number :model-value="openDelayMax" @update:model-value="$emit('update:openDelayMax', $event)" :min="openDelay + 100" :max="30000" :step="100" size="small" controls-position="right" />
                </template>
                <span class="config_unit">ms</span>
                <el-switch :model-value="openDelayRandom" @update:model-value="$emit('update:openDelayRandom', $event)" size="small" active-text="随机" inactive-text="固定" />
            </template>
        </div>
    </div>
</template>

<script setup>
defineProps({
    numData: { type: Number, default: 1 },
    openDelaySwitch: { type: Boolean, default: false },
    openDelay: { type: Number, default: 500 },
    openDelayMax: { type: Number, default: 1500 },
    openDelayRandom: { type: Boolean, default: false }
})

defineEmits([
    'update:numData',
    'update:openDelaySwitch',
    'update:openDelay',
    'update:openDelayMax',
    'update:openDelayRandom'
])
</script>

<style lang='scss' scoped>
.config_bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid var(--g-home-link-border);
    border-radius: 8px;
    margin-bottom: 20px;
}
.config_group {
    display: flex;
    align-items: center;
    gap: 6px;
}
.config_label {
    font-style: normal;
    font-size: 13px;
    white-space: nowrap;
}
.config_sep {
    width: 1px;
    height: 24px;
    background-color: var(--g-home-link-border);
}
.config_sep_text {
    font-size: 13px;
    color: var(--g-body-text-color);
    opacity: 0.5;
}
.config_unit {
    font-style: normal;
    font-size: 12px;
    color: var(--g-body-text-color);
    opacity: 0.5;
    white-space: nowrap;
}
</style>