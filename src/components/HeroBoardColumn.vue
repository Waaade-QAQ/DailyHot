<template>
  <section class="board-col">
    <div class="col-head">
      <div class="col-titles">
        <h2 class="col-title">{{ title }}</h2>
        <span class="col-sub">{{ subtitle }}</span>
      </div>
      <button v-if="showMore" class="col-more" @click="emit('more')">
        全部
        <span class="arrow">→</span>
      </button>
    </div>
    <RankRow
      v-for="(item, index) in rows"
      :key="`${rowKey(item)}`"
      :rank="index + 1"
      :item="item"
      variant="hero"
      :max-hot="maxHot"
    />
    <div v-if="!rows.length" class="col-empty">{{ emptyText }}</div>
  </section>
</template>

<script setup>
import RankRow from "@/components/RankRow.vue";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  rows: { type: Array, default: () => [] },
  maxHot: { type: Number, default: 0 },
  showMore: { type: Boolean, default: false },
  emptyText: { type: String, default: "暂无数据" },
});

const emit = defineEmits(["more"]);

const rowKey = (item) => `${item.kind || "x"}-${item.id || item.title}`;
</script>

<style lang="scss" scoped>
.board-col {
  min-width: 0;
  padding-bottom: 4px;
}

.col-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 4px 12px 6px;

  .col-titles {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  .col-title {
    font-size: 15px;
    font-weight: 800;
    color: var(--dh-text-main);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    &::before {
      content: "";
      width: 5px;
      height: 14px;
      border-radius: 3px;
      background-color: var(--dh-brand);
    }
  }

  .col-sub {
    font-size: 11px;
    color: var(--dh-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .col-more {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: var(--dh-brand);
    padding: 4px 2px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;

    .arrow { transition: transform 0.2s; }
    &:hover .arrow { transform: translateX(3px); }
  }
}

.col-empty {
  padding: 18px 12px;
  font-size: 13px;
  color: var(--dh-text-muted);
}
</style>
