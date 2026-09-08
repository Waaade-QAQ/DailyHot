<template>
  <div class="setting-row" :class="{ 'is-vertical': vertical }">
    <div class="info">
      <span class="title">{{ title }}</span>
      <span class="desc" v-if="description">{{ description }}</span>
    </div>
    <div class="action-slot">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  vertical: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.setting-row {
  background-color: var(--dh-bg-surface);
  border: 1px solid var(--dh-border-hairline);
  border-radius: var(--dh-radius-card);
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: background-color 0.25s, border-color 0.25s;

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      font-size: 15px;
      font-weight: 600;
      color: var(--dh-text-main);
    }

    .desc {
      font-size: 12px;
      color: var(--dh-text-muted);
    }
  }

  .action-slot {
    flex-shrink: 0;
  }

  &.is-vertical {
    flex-direction: column;
    align-items: stretch;
    .action-slot {
      margin-top: 8px;
    }
  }
}
</style>
