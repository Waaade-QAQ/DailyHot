<template>
  <div class="tag-container" v-if="categories.length">
    <div
      v-for="item in categories"
      :key="item.name"
      class="category-chip"
      :class="{
        active: item.name === currentType,
        featured: item.name === 'douyin-parenting',
      }"
      @click="emit('change', item.name)"
    >
      <LogoMark
        :name="item.name"
        :label="item.label"
        :size="16"
        :radius="5"
        :inverse="item.name === currentType"
      />
      <span class="chip-label">{{ item.label }}</span>
      <span v-if="item.name === 'douyin-parenting'" class="parenting-tag">亲子</span>
    </div>
  </div>
</template>

<script setup>
import LogoMark from "@/components/LogoMark.vue";

defineProps({
  categories: { type: Array, required: true },
  currentType: { type: String, required: true },
});

const emit = defineEmits(["change"]);
</script>

<style lang="scss" scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  .category-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: var(--dh-radius-pill);
    background-color: var(--dh-bg-surface);
    border: 1px solid var(--dh-border-hairline);
    cursor: pointer;
    font-size: 13px;
    color: var(--dh-text-secondary);
    transition: all 0.2s;

    .parenting-tag {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 4px;
      background-color: var(--dh-brand);
      color: #ffffff;
    }

    &:hover {
      border-color: var(--dh-brand);
      color: var(--dh-brand);
    }

    &.active {
      background-color: var(--dh-brand);
      border-color: var(--dh-brand);
      color: #ffffff;

      .parenting-tag {
        background-color: rgba(255, 255, 255, 0.25);
      }
    }
  }
}
</style>
