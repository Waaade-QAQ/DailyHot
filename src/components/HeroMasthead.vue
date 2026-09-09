<template>
  <div class="masthead">
    <div class="eyebrow">
      <span class="red-mark" />
      <span class="label">抖音亲子日刊</span>
      <span class="meta" v-if="updateText">共 {{ total }} 条 · {{ updateText }}</span>
    </div>
    <div class="headline-bar">
      <h1 class="title">抖音<span class="accent">亲子</span>热榜</h1>
      <n-tooltip>
        <template #trigger>
          <n-button secondary round strong size="small" class="hero-refresh" @click="emit('refresh')">
            <template #icon><n-icon :component="Refresh" /></template>
            刷新
          </n-button>
        </template>
        60秒刷新冷却
      </n-tooltip>
    </div>
  </div>
</template>

<script setup>
import { Refresh } from "@icon-park/vue-next";

defineProps({
  total: { type: Number, default: 0 },
  updateText: { type: String, default: "" },
});

const emit = defineEmits(["refresh"]);
</script>

<style lang="scss" scoped>
.masthead {
  margin-bottom: 14px;
  border-bottom: 1px solid var(--dh-border-subtle);
  padding-bottom: 12px;

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;

    .red-mark { width: 8px; height: 8px; border-radius: 2px; background-color: var(--dh-brand); }
    .label { font-size: 13px; font-weight: 700; color: var(--dh-text-main); }
    .meta { font-size: 12px; color: var(--dh-text-secondary); }
  }

  .headline-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 32px; font-weight: 800; color: var(--dh-text-main); line-height: 1.2;
      .accent { color: var(--dh-brand); }
    }
  }

  .hero-refresh {
    background-color: var(--dh-bg-surface) !important;
  }

  @media (max-width: 768px) {
    .headline-bar .title { font-size: 26px; }
  }
}
</style>
