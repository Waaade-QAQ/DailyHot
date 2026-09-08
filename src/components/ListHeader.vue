<template>
  <div class="card-header">
    <div class="platform-meta">
      <LogoMark :name="name" :label="title" :size="26" :radius="8" />
      <div class="title-row">
        <h1 class="main-title">{{ title }}</h1>
        <span v-if="total" class="total-badge">共 {{ total }}</span>
      </div>
    </div>
    <span class="time-text">{{ updateText || '更新中...' }}</span>
  </div>
</template>

<script setup>
import LogoMark from "@/components/LogoMark.vue";

defineProps({
  name: { type: String, required: true },
  title: { type: String, default: "" },
  total: { type: [Number, String], default: 0 },
  updateText: { type: String, default: "" },
});
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--dh-border-hairline);
  margin-bottom: 12px;

  .platform-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    .main-title { font-size: 20px; font-weight: 700; color: var(--dh-text-main); }
    .total-badge { font-size: 12px; color: var(--dh-text-muted); }
  }

  .time-text { font-size: 12px; color: var(--dh-text-muted); }
}
</style>
