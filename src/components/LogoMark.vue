<template>
  <span class="logo-mark" :style="boxStyle">
    <span v-if="isParenting" class="mark-char" :class="{ inverse }" :style="charStyle">亲</span>
    <img
      v-else-if="!imgFailed"
      :src="`/logo/${name}.png`"
      :alt="label"
      class="mark-img"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="imgFailed = true"
    />
    <span v-else class="mark-char" :class="{ inverse }" :style="charStyle">{{ labelFirst }}</span>
  </span>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  size: { type: Number, default: 24 },
  radius: { type: Number, default: 0 },
  inverse: { type: Boolean, default: false },
});

const imgFailed = ref(false);
const isParenting = computed(() => props.name === "douyin-parenting");
const labelFirst = computed(() => (props.label || props.name).slice(0, 1));

const boxStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: `${props.radius}px`,
}));

const charStyle = computed(() => ({
  fontSize: `${Math.round(props.size * 0.5)}px`,
}));
</script>

<style lang="scss" scoped>
.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background-color: var(--dh-bg-overlay);

  .mark-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: var(--dh-bg-overlay);
  }

  .mark-char {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: 800;
    background-color: var(--dh-brand);
    color: #fff;
    user-select: none;

    &.inverse {
      background-color: #fff;
      color: var(--dh-brand);
    }
  }
}
</style>
