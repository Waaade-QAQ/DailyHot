<template>
  <div
    class="rank-row"
    :class="[`variant-${variant}`, { 'has-heat': showHeat && maxHot > 0 }]"
    @click="handleClick"
  >
    <RankBadge :rank="rank" :variant="variant" />
    <img
      v-if="showThumb"
      :src="item.cover"
      alt=""
      class="row-thumb"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="thumbFailed = true"
    />
    <div class="main-col">
      <span
        class="title"
        :style="{ fontSize: rowFontSize }"
      >
        <span v-if="isTopic" class="hash-mark">#</span
        ><span v-html="item.title" />
      </span>
      <span
        v-if="variant === 'list' && item.desc"
        class="desc"
        v-html="item.desc"
      />
    </div>
    <span v-if="kindChip" class="kind-chip" :class="`kind-${item.kind}`">{{
      kindChip
    }}</span>
    <RankHeat
      v-if="showHeat && maxHot > 0"
      :hot="item.hot"
      :max-hot="maxHot"
      :rank="rank"
      :variant="variant"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import RankBadge from "@/components/RankBadge.vue";
import RankHeat from "@/components/RankHeat.vue";
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

const thumbFailed = ref(false);
const isTopic = computed(() => props.item?.kind === "topic");

const showThumb = computed(
  () =>
    props.variant === "hero" &&
    !isTopic.value &&
    props.item?.cover &&
    !thumbFailed.value,
);

const kindChip = computed(() => {
  if (props.variant !== "list" || !props.item?.kind) return "";
  return props.item.kind === "topic" ? "话题" : "热点";
});

const rowFontSize = computed(() => {
  if (props.fontSize > 0) return `${props.fontSize}px`;
  const base = store.listFontSize || 16;
  return props.variant === "hero" ? `${base + 2}px` : `${base}px`;
});

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

  .row-thumb {
    width: 24px;
    height: 32px;
    border-radius: 5px;
    object-fit: cover;
    flex-shrink: 0;
    margin-left: 8px;
    background-color: var(--dh-bg-overlay);
  }

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

      .hash-mark {
        color: var(--dh-text-muted);
        font-weight: 600;
        margin-right: 2px;
      }
    }
  }

  .kind-chip {
    flex-shrink: 0;
    margin-left: 8px;
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    padding: 4px 6px;
    border-radius: 4px;
    background-color: rgba(254, 44, 85, 0.1);
    color: var(--dh-brand);
  }

  &:hover .main-col .title {
    color: var(--dh-brand);
  }

  &.variant-hero {
    min-height: 36px;
    padding: 2px 10px;
    border-radius: 10px;
    border: 1px solid transparent;

    &:hover {
      border-color: var(--dh-heat-track);
      background-color: var(--dh-heat-track);
    }

    .main-col { margin-left: 8px; }
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
