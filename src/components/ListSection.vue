<template>
  <div class="list-section">
    <div class="section-head">
      <span class="sec-title">{{ title }}</span>
      <span class="sec-count">{{ rows.length }} 条</span>
    </div>
    <RankRow
      v-for="(item, index) in rows"
      :key="`${item.kind || 'x'}-${item.id || index}`"
      :rank="index + 1"
      :item="item"
      variant="list"
      :max-hot="maxHot"
    />
  </div>
</template>

<script setup>
import RankRow from "@/components/RankRow.vue";

defineProps({
  title: { type: String, required: true },
  rows: { type: Array, required: true },
  maxHot: { type: Number, default: 0 },
});
</script>

<style lang="scss" scoped>
.list-section {
  .section-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 8px 4px;

    .sec-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--dh-text-main);
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &::before {
        content: "";
        width: 5px;
        height: 14px;
        border-radius: 3px;
        background-color: var(--dh-brand);
      }
    }

    .sec-count {
      font-size: 12px;
      color: var(--dh-text-muted);
    }
  }
}
</style>
