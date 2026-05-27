<template>
  <div class="theme_panel">
    <!-- 数据导入导出 -->
    <el-popover placement="bottom-end" :width="200" trigger="click" :show-arrow="false">
      <template #reference>
        <div class="theme_trigger data_trigger">
          <el-icon :size="22"><Setting /></el-icon>
        </div>
      </template>
      <div class="panel_content">
        <div class="data_actions">
          <el-button size="small" text class="data_btn" @click="exportAll">
            <el-icon :size="14"><Download /></el-icon>
            <span>导出备份</span>
          </el-button>
          <el-button size="small" text class="data_btn" @click="triggerImport">
            <el-icon :size="14"><Upload /></el-icon>
            <span>导入恢复</span>
          </el-button>
        </div>
        <input ref="importInput" type="file" accept=".json" style="display:none" @change="onImportFile" />
      </div>
    </el-popover>
    <!-- 主题/风格 -->
    <el-popover placement="bottom-end" :width="240" trigger="click" :show-arrow="false">
      <template #reference>
        <div class="theme_trigger">
          <el-icon v-if="darkStore.darkMode === 'light'" :size="22"><Sunny /></el-icon>
          <el-icon v-else :size="22"><Moon /></el-icon>
        </div>
      </template>
      <div class="panel_content">
        <!-- 亮/暗切换 -->
        <div class="panel_section">
          <span class="section_label">主题模式</span>
          <div class="mode_row">
            <span class="mode_label" :class="{ 'is-active': darkStore.darkMode === 'light' }">
              <el-icon :size="16"><Sunny /></el-icon> 浅色
            </span>
            <el-switch
              :model-value="darkStore.darkMode === 'dark'"
              @update:model-value="onDarkSwitch"
              size="small"
            />
            <span class="mode_label" :class="{ 'is-active': darkStore.darkMode === 'dark' }">
              <el-icon :size="16"><Moon /></el-icon> 深色
            </span>
          </div>
        </div>
        <!-- 风格选择 -->
        <div class="panel_section">
          <span class="section_label">视觉风格</span>
          <div class="style_grid">
            <div
              v-for="opt in STYLE_OPTIONS"
              :key="opt.key"
              class="style_card"
              :class="{ 'is-active': effectiveStyle === opt.key }"
              @click="onStyleSelect(opt.key)"
            >
              <div class="style_card_header">
                <span class="style_card_name">{{ opt.label }}</span>
                <span v-if="opt.key === 'monochrome' && FORCE_MONOCHROME" class="style_badge style_badge_mono">
                  <el-icon :size="10"><Lock /></el-icon> 已锁定
                </span>
                <span v-if="opt.preferDark === true" class="style_badge style_badge_dark">深色最佳</span>
                <span v-else-if="opt.preferDark === false" class="style_badge style_badge_light">浅色最佳</span>
              </div>
              <span class="style_card_desc">{{ opt.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sunny, Moon, Download, Upload, Setting, Lock } from '@element-plus/icons-vue'
import useDarkStore from '../stores/darkStore'
import { useStyle, FORCE_MONOCHROME } from '../composables/useStyle'
import { useGlobalExportBridge } from '../composables/useGlobalExport'

const darkStore = useDarkStore()
const { currentStyle, setStyle, STYLE_OPTIONS } = useStyle()
const { exportBridge, importBridge } = useGlobalExportBridge()

const importInput = ref(null)

// 实际生效的风格：强制模式下永远是 monochrome
const effectiveStyle = computed(() => {
  return FORCE_MONOCHROME ? 'monochrome' : currentStyle.value
})

const onStyleSelect = (key) => {
  if (FORCE_MONOCHROME) return
  setStyle(key)
}

const exportAll = () => {
  exportBridge.value?.()
}

const triggerImport = () => {
  importInput.value?.click()
  document.activeElement?.blur()
}

const onImportFile = (e) => {
  importBridge.value?.(e)
}

const onDarkSwitch = (val) => {
  darkStore.setDark(val)
}
</script>

<style lang='scss' scoped>
.theme_trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: color-mix(in srgb, var(--el-color-primary) 6%, transparent);
  border-radius: 6px;
  padding: 6px;
  transition: background-color 0.2s;
  &:hover {
    background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
  }
}
.panel_content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.panel_section {
  padding: 6px 0;
}
.section_label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--g-body-text-color);
  opacity: 0.45;
  display: block;
  margin-bottom: 8px;
}
.mode_row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.mode_label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--g-body-text-color);
  opacity: 0.5;
  transition: opacity 0.2s;
  &.is-active {
    opacity: 1;
    color: var(--el-color-primary);
  }
}
.style_grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.style_card {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s, outline 0.15s;
  outline: 1.5px solid transparent;
  &:hover {
    background-color: color-mix(in srgb, var(--el-color-primary) 8%, transparent);
  }
  &.is-active {
    background-color: color-mix(in srgb, var(--el-color-primary) 15%, transparent);
    outline-color: var(--el-color-primary);
  }
}
.style_card_header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.style_card_name {
  font-size: 14px;
  font-weight: 600;
  color: var(--g-body-text-color);
}
.style_card_desc {
  font-size: 12px;
  color: var(--g-body-text-color);
  opacity: 0.55;
}
.style_badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 500;
}
.style_badge_dark {
  background-color: color-mix(in srgb, var(--el-color-primary) 15%, transparent);
  color: var(--el-color-primary);
}
.style_badge_light {
  background-color: color-mix(in srgb, var(--el-color-primary) 15%, transparent);
  color: var(--el-color-primary);
}
.style_badge_mono {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background-color: rgba(0, 0, 0, 0.08);
  color: #333;
}
.dark .style_badge_mono {
  background-color: rgba(255, 255, 255, 0.12);
  color: #ddd;
}
.theme_panel {
  display: flex;
  align-items: center;
  gap: 8px;
}
.data_actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.data_btn {
  width: 100%;
  justify-content: flex-start;
  font-size: 13px;
  padding: 8px 12px;
  gap: 8px;
  border-radius: 6px;
  color: var(--g-body-text-color);
  margin-left: 0 !important;
  &:hover {
    background-color: color-mix(in srgb, var(--el-color-primary-light-3) 20%, transparent) !important;
    color: var(--el-color-primary);
  }
}
</style>

<!-- el-popover 的内容会被 teleport 到 body 下，scoped 样式不生效，
     故使用非 scoped 样式处理默认主题（无 data-style）的深色模式适配 -->
<style lang="scss">
/* --- 布局/结构样式（在主题CSS中也有定义，带 !important） --- */
.panel_content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.panel_section {
  padding: 6px 0;
}
.section_label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 8px;
}
.mode_row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.mode_label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  transition: opacity 0.2s;
}
.style_grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.style_card {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s, outline 0.15s;
  outline: 1.5px solid transparent;
}
.style_card_header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.style_card_name {
  font-size: 14px;
  font-weight: 600;
}
.style_card_desc {
  font-size: 12px;
  opacity: 0.55;
}
.style_badge_dark,
.style_badge_light {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 500;
}
.data_trigger {
  border-radius: 6px;
  padding: 6px;
  transition: background-color 0.2s;
}
.data_btn {
  width: 100%;
  justify-content: flex-start;
  font-size: 13px;
  padding: 8px 12px;
  gap: 8px;
  border-radius: 6px;
  margin-left: 0;
}

/* --- 默认主题 - 浅色配色 --- */
html:not([data-style]) {
  .section_label {
    color: #000;
    opacity: 0.45;
  }
  .mode_label {
    color: #000;
    opacity: 0.5;
    &.is-active {
      opacity: 1;
      color: var(--el-color-primary);
    }
  }
  .style_card {
    &:hover {
      background-color: color-mix(in srgb, var(--el-color-primary) 8%, transparent);
    }
    &.is-active {
      background-color: color-mix(in srgb, var(--el-color-primary) 15%, transparent);
      outline-color: var(--el-color-primary);
    }
  }
  .style_card_name {
    color: #000;
  }
  .style_card_desc {
    color: #000;
  }
  .style_badge_dark,
  .style_badge_light {
    background-color: color-mix(in srgb, var(--el-color-primary) 15%, transparent);
    color: var(--el-color-primary);
  }
  .data_trigger {
    background-color: color-mix(in srgb, var(--el-color-primary) 6%, transparent);
    &:hover {
      background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
    }
  }
  .data_btn {
    color: #000;
    &:hover {
      background-color: color-mix(in srgb, var(--el-color-primary-light-3) 20%, transparent) !important;
      color: var(--el-color-primary);
    }
  }
}

/* --- 默认主题 - 深色配色 --- */
html.dark:not([data-style]) {
  .section_label {
    color: rgba(255, 255, 255, 0.87);
    opacity: 0.6;
  }
  .mode_label {
    color: rgba(255, 255, 255, 0.87);
    opacity: 0.5;
    &.is-active {
      opacity: 1;
      color: #22c55e;
    }
  }
  .style_card {
    &:hover {
      background-color: rgba(34, 197, 94, 0.15);
    }
    &.is-active {
      background-color: rgba(34, 197, 94, 0.28);
      outline-color: #22c55e;
    }
  }
  .style_card_name {
    color: rgba(255, 255, 255, 0.87);
  }
  .style_card_desc {
    color: rgba(255, 255, 255, 0.87);
  }
  .style_badge_dark,
  .style_badge_light {
    background-color: rgba(34, 197, 94, 0.25);
    color: #86efac;
  }
  .data_trigger {
    background-color: rgba(34, 197, 94, 0.12);
    &:hover {
      background-color: rgba(34, 197, 94, 0.22);
    }
  }
  .data_btn {
    color: rgba(255, 255, 255, 0.87);
    &:hover {
      background-color: rgba(34, 197, 94, 0.15) !important;
      color: #22c55e;
    }
  }
}
</style>