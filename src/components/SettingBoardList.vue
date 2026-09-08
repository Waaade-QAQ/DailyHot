<template>
  <div class="board-settings-card">
    <div class="header-row">
      <div class="info">
        <span class="title">榜单排序与可见性</span>
        <span class="desc">拖拽卡片调整顺序，右侧开关控制榜单显隐</span>
      </div>
      <n-popconfirm @positive-click="restoreDefault">
        <template #trigger>
          <n-button size="small" secondary round>恢复默认</n-button>
        </template>
        确认将榜单排序恢复到默认状态？
      </n-popconfirm>
    </div>

    <draggable
      :list="newsArr"
      :animation="200"
      class="boards-grid"
      item-key="name"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <div class="board-item-card" :class="{ disabled: !element.show }">
          <div class="drag-info">
            <LogoMark :name="element.name" :label="element.label" :size="24" :radius="7" />
            <span class="label">{{ element.label }}</span>
          </div>
          <n-switch
            size="small"
            v-model:value="element.show"
            @update:value="(val) => onToggle(element.label, val)"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import LogoMark from "@/components/LogoMark.vue";

const props = defineProps({
  newsArr: { type: Array, required: true },
});

const emit = defineEmits(["restore", "update-order", "toggle"]);

const restoreDefault = () => {
  emit("restore");
};

const onDragEnd = () => {
  emit("update-order");
};

const onToggle = (label, val) => {
  emit("toggle", { label, show: val });
};
</script>

<style lang="scss" scoped>
.board-settings-card {
  background-color: var(--dh-bg-surface);
  border: 1px solid var(--dh-border-hairline);
  border-radius: var(--dh-radius-card);
  padding: 18px 20px;
  margin-bottom: 16px;

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--dh-border-hairline);

    .info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      .title { font-size: 15px; font-weight: 600; color: var(--dh-text-main); }
      .desc { font-size: 12px; color: var(--dh-text-muted); }
    }
  }

  .boards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 540px) { grid-template-columns: 1fr; }

    .board-item-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 10px;
      background-color: var(--dh-bg-overlay);
      border: 1px solid var(--dh-border-hairline);
      cursor: grab;
      user-select: none;
      transition: all 0.2s;

      &:active { cursor: grabbing; }
      &.disabled { opacity: 0.55; }

      .drag-info {
        display: flex;
        align-items: center;
        gap: 8px;
        .label { font-size: 13px; font-weight: 500; color: var(--dh-text-main); }
      }
    }
  }
}
</style>
