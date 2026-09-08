<template>
  <div class="board-card" :id="`hot-list-${hotData.name}`">
    <!-- 头部平台信息 -->
    <div class="card-header" @click="toList">
      <div class="platform-info">
        <LogoMark :name="hotData.name" :label="hotData.label" :size="24" :radius="8" />
        <span class="platform-name">{{ hotData.label }}</span>
      </div>
      <span class="subtitle" v-if="hotListData?.type">{{ hotListData.type }}</span>
    </div>

    <!-- 榜单滚动列表 -->
    <n-scrollbar class="card-scroll" ref="scrollbarRef">
      <div v-if="loadingError" class="card-state error">
        <n-result size="small" status="500" title="加载失败" style="margin-top: 20px" />
        <n-button size="tiny" secondary round @click.stop="fetchData(true)">重试</n-button>
      </div>
      <div v-else-if="listLoading && !items.length" class="skeleton-list">
        <n-skeleton v-for="i in 8" :key="i" height="24px" round style="margin-bottom: 8px" />
      </div>
      <div v-else class="card-items">
        <RankRow
          v-for="(item, index) in items"
          :key="item.url || index"
          :rank="index + 1"
          :item="item"
          variant="card"
          :max-hot="maxHot"
        />
      </div>
    </n-scrollbar>

    <!-- 尾部状态与操作 -->
    <div class="card-footer">
      <span class="update-time">{{
        loadingError ? '获取失败' : updateTime || '更新中...'
      }}</span>
      <div class="card-actions">
        <n-tooltip v-if="hotListData?.data?.length > 15">
          <template #trigger>
            <n-button size="tiny" secondary round @click.stop="toList">
              <template #icon><n-icon :component="More" /></template>
            </n-button>
          </template>
          查看更多
        </n-tooltip>
        <n-tooltip>
          <template #trigger>
            <n-button size="tiny" secondary round @click.stop="getNewData">
              <template #icon><n-icon :component="Refresh" /></template>
            </n-button>
          </template>
          获取最新（60s冷却）
        </n-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { Refresh, More } from "@icon-park/vue-next";
import { useHotList } from "@/composables/useHotList";
import { goList } from "@/utils/link";
import RankRow from "@/components/RankRow.vue";
import LogoMark from "@/components/LogoMark.vue";

const props = defineProps({
  hotData: { type: Object, required: true },
});

const router = useRouter();
const {
  hotListData,
  items,
  maxHot,
  listLoading,
  loadingError,
  updateTime,
  scrollbarRef,
  fetchData,
  getNewData,
  initObserver,
} = useHotList(props.hotData.name, { limit: 15 });

const toList = () => goList(router, props.hotData.name);

onMounted(() => initObserver(`hot-list-${props.hotData.name}`));
</script>

<style lang="scss" scoped>
.board-card {
  background-color: var(--dh-bg-surface);
  border: 1px solid var(--dh-border-hairline);
  border-radius: var(--dh-radius-card);
  box-shadow: var(--dh-shadow-sm);
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.25s, border-color 0.25s;

  &:hover {
    box-shadow: var(--dh-shadow-md);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin-bottom: 10px;

    .platform-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .platform-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--dh-text-main);
      }
    }

    .subtitle {
      font-size: 12px;
      color: var(--dh-text-muted);
    }
  }

  .card-scroll {
    height: 296px;
    .card-items {
      display: flex;
      flex-direction: column;
    }
    .skeleton-list {
      padding: 6px 0;
    }
    .card-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--dh-border-hairline);

    .update-time {
      font-size: 11px;
      color: var(--dh-text-muted);
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
}
</style>
