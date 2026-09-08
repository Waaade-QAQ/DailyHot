<template>
  <div class="group-tabs">
    <button
      v-for="g in options"
      :key="g.value"
      class="group-chip"
      :class="{ active: current === g.value }"
      @click="emit('change', g.value)"
    >
      {{ g.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  options: { type: Array, required: true },
  current: { type: String, required: true },
});

const emit = defineEmits(["change"]);
</script>

<style lang="scss" scoped>
.group-tabs {
  display: flex;
  gap: 8px;
  margin: 4px 0 12px;
  flex-wrap: wrap;

  .group-chip {
    border: 1px solid var(--dh-border-hairline);
    background-color: var(--dh-bg-overlay);
    color: var(--dh-text-secondary);
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: var(--dh-radius-pill);
    cursor: pointer;
    transition: all 0.2s;

    &:hover { border-color: var(--dh-brand); color: var(--dh-brand); }
    &.active {
      background-color: var(--dh-brand);
      border-color: var(--dh-brand);
      color: #fff;
    }
  }
}
</style>
