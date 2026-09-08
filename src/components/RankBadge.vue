<template>
  <span
    class="rank-badge"
    :class="[
      `variant-${variant}`,
      rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : 'top-other',
    ]"
  >
    {{ rank }}
  </span>
</template>

<script setup>
defineProps({
  rank: {
    type: Number,
    required: true,
  },
  variant: {
    type: String,
    default: "card", // hero | card | list
  },
});
</script>

<style lang="scss" scoped>
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  border-radius: 6px;
  line-height: 1;

  &.top-1 {
    background-color: var(--dh-rank-1);
    color: #ffffff;
  }
  &.top-2 {
    background-color: var(--dh-rank-2);
    color: #ffffff;
  }
  &.top-3 {
    background-color: var(--dh-rank-3);
    color: #ffffff;
  }
  &.top-other {
    background-color: transparent;
    color: var(--dh-text-secondary);
  }

  &.variant-hero {
    width: 24px;
    height: 24px;
    font-size: 13px;
    border-radius: 6px;
  }

  &.variant-card {
    width: 20px;
    height: 20px;
    font-size: 12px;
    border-radius: 5px;
    &.top-other {
      color: var(--dh-text-muted);
    }
  }

  &.variant-list {
    width: 26px;
    height: 26px;
    font-size: 14px;
    border-radius: 6px;
  }
}
</style>
