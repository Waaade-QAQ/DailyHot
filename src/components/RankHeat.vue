<template>
  <div class="heat-col" :class="[`variant-${variant}`, { 'has-bar': variant === 'hero' }]">
    <span class="hot-text" :class="{ 'top-tier': rank <= 3 }">{{ text }}</span>
    <div v-if="variant === 'hero'" class="heat-bar-track">
      <div
        class="heat-bar-fill"
        :class="{ 'top-tier': rank <= 3 }"
        :style="{ width: pct + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatHot, heatPct } from "@/utils/boardFormat";

const props = defineProps({
  hot: { type: [String, Number], default: null },
  maxHot: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  variant: { type: String, default: "card" },
});

const text = computed(() => formatHot(props.hot));
const pct = computed(() => heatPct(props.hot, props.maxHot));
</script>

<style lang="scss" scoped>
.heat-col {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;

  .hot-text {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: var(--dh-text-muted);
    text-align: right;

    &.top-tier {
      color: var(--dh-brand);
      font-weight: 600;
    }
  }

  &.variant-card .hot-text {
    font-size: 11px;
  }

  &.variant-hero .hot-text {
    color: var(--dh-text-secondary);
  }

  .heat-bar-track {
    width: 48px;
    height: 4px;
    background-color: var(--dh-heat-track);
    border-radius: 2px;
    overflow: hidden;

    .heat-bar-fill {
      height: 100%;
      background-color: var(--dh-rank-coral);
      border-radius: 2px;
      transition: width 0.3s ease;

      &.top-tier {
        background-color: var(--dh-brand);
      }
    }
  }
}
</style>
