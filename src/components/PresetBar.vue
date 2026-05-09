<template>
    <div class="preset_tags" v-if="presets.length">
        <el-tag
            v-for="item in presets"
            :key="item.id"
            :type="activePresetId === item.id ? 'primary' : 'info'"
            :effect="activePresetId === item.id ? 'dark' : 'plain'"
            size="large"
            closable
            :disable-transitions="false"
            class="preset_tag"
            :class="{ 'preset_tag-active': activePresetId === item.id }"
            @click="$emit('applyPreset', item)"
            @close.stop="$emit('deletePreset', item)"
        >
            {{ item.name }}
        </el-tag>
    </div>
</template>

<script setup>
defineProps({
    presets: { type: Array, required: true },
    activePresetId: { type: String, default: '' }
})

defineEmits(['applyPreset', 'deletePreset'])
</script>

<style lang='scss' scoped>
.preset_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}
.preset_tag {
    cursor: pointer;
    min-width: 90px;
    display: inline-flex;
    align-items: center;
    :deep(.el-tag__content) {
        flex: 1;
        text-align: center;
        font-size: 14px;
        font-weight: 900;
    }
    :deep(.el-tag__close) {
        margin-left: auto;
    }
}
.preset_tag-active {
    --el-tag-bg-color: var(--el-color-primary);
    --el-tag-text-color: #fff;
    --el-tag-border-color: var(--el-color-primary);
}
</style>