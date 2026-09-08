<template>
  <div
    class="rank-row"
    :class="[`variant-${variant}`, { 'has-heat': showHeat && maxHot > 0 }]"
    @click="handleClick"
  >
    <RankBadge :rank="rank" :variant="variant" />
    <div class="main-col">
      <span
        class="title"
        :style="{ fontSize: rowFontSize }"
        v-html="item.title"
      />
      <span
        v-if="variant === 'list' && item.desc"
        class="desc"
        v-html="item.desc"
      />
    </div>
    <div
      v-if="showHeat && maxHot > 0"
      class="heat-col"
      :class="{ 'has-bar': variant === 'hero' }"
    >
      <span class="hot-text">{{ formattedHot }}</span>
      <div v-if="variant === 'hero'" class="heat-bar-track">
        <div
          class="heat-bar-fill"
          :class="{ 'top-tier': rank <= 3 }"
          :style="{ width: heatWidth + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import RankBadge from "@/components/RankBadge.vue";
import { formatHot, heatPct } from "@/utils/boardFormat";
import { openHotLink } from "@/utils/link";
import { mainStore } from "@/store";

const props = defineProps({
  rank: { type: Number, required: true },
  item: { type: Object, required: true },
  variant: { type: String, default: "card" }, // hero | card | list
  maxHot: { type: Number, default: 0 },
  showHeat: { type: Boolean, default: true },
  fontSize: { type: Number, default: 0 },
});

const emit = defineEmits(["open"]);
const store = mainStore();

const rowFontSize = computed(() => {
  if (props.fontSize > 0) return `${props.fontSize}px`;
  const base = store.listFontSize || 16;
  return props.variant === "hero" ? `${base + 2}px` : `${base}px`;
});

const formattedHot = computed(() => formatHot(props.item?.hot));
const heatWidth = computed(() => heatPct(props.item?.hot, props.maxHot));

const handleClick = () => {
  emit("open", props.item);
  openHotLink(props.item, store.linkOpenType);
};
</script>

<style lang="scss" scoped>
.rank-row {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;

  .main-col {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--dh-text-main);
      font-weight: 500;
      transition: color 0.15s;
    }
  }

  &:hover .main-col .title {
    color: var(--dh-brand);
  }

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

  &.variant-hero {
    min-height: 42px;
    padding: 6px 12px;
    border-radius: 10px;
    border: 1px solid transparent;

    &:hover {
      border-color: var(--dh-heat-track);
      background-color: var(--dh-heat-track);
    }

    .heat-col .hot-text {
      color: var(--dh-text-secondary);
    }
  }

  &.variant-card {
    height: 34px;
    padding: 0 8px;
    border-radius: 6px;

    &:hover {
      background-color: var(--dh-bg-hover);
    }

    .main-col {
      margin-left: 8px;
    }

    .heat-col .hot-text {
      font-size: 11px;
    }
  }

  &.variant-list {
    padding: 12px 16px;
    border-bottom: 1px solid var(--dh-border-hairline);
    border-radius: 0;

    &:hover {
      background-color: var(--dh-bg-hover);
    }

    .desc {
      font-size: 13px;
      color: var(--dh-text-muted);
      margin-top: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
