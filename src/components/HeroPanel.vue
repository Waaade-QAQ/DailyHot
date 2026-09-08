<template>
  <div class="hero-panel" id="hot-list-douyin-parenting">
    <!-- 刊眉与刊头 -->
    <div class="masthead">
      <div class="eyebrow">
        <span class="red-mark" />
        <span class="label">抖音亲子日刊</span>
        <span class="meta" v-if="updateTime">共 {{ hotListData?.data?.length || 0 }} 条 · {{ updateTime }}</span>
      </div>
      <div class="headline-bar">
        <div class="headline">
          <h1 class="title">抖音<span class="accent">亲子</span>热榜</h1>
        </div>
        <n-tooltip>
          <template #trigger>
            <n-button secondary round strong size="small" class="hero-refresh" @click="getNewData">
              <template #icon><n-icon :component="Refresh" /></template>
              刷新
            </n-button>
          </template>
          60秒刷新冷却
        </n-tooltip>
      </div>
    </div>

    <!-- 列表内容 -->
    <div v-if="loadingError" class="state-box">
      <n-result size="small" status="500" title="热榜加载失败" description="请检查网络连接后重试" />
      <n-button secondary round size="small" @click="fetchData(true)">重试</n-button>
    </div>
    <div v-else-if="listLoading && !items.length" class="hero-grid">
      <n-skeleton v-for="i in 12" :key="i" height="38px" round />
    </div>
    <div v-else class="hero-grid">
      <RankRow
        v-for="(item, index) in items"
        :key="item.url || index"
        :rank="index + 1"
        :item="item"
        variant="hero"
        :max-hot="maxHot"
      />
    </div>

    <!-- 底部跳转更多 -->
    <div class="panel-footer">
      <n-button text class="more-link" @click="goList(router, 'douyin-parenting')">
        查看完整榜单 <span class="arrow">→</span>
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { Refresh } from "@icon-park/vue-next";
import { useHotList } from "@/composables/useHotList";
import { goList } from "@/utils/link";
import RankRow from "@/components/RankRow.vue";

const router = useRouter();
const {
  hotListData,
  items,
  maxHot,
  listLoading,
  loadingError,
  updateTime,
  fetchData,
  getNewData,
  initObserver,
} = useHotList("douyin-parenting", { limit: 12 });

onMounted(() => initObserver("hot-list-douyin-parenting"));
</script>

<style lang="scss" scoped>
.hero-panel {
  background-color: var(--dh-brand-soft);
  border: 1px solid var(--dh-border-subtle);
  border-radius: var(--dh-radius-hero);
  box-shadow: var(--dh-shadow-md);
  padding: 24px 30px 18px;
  margin-bottom: 28px;
  transition: background-color 0.25s, border-color 0.25s;

  .masthead {
    margin-bottom: 16px;
    border-bottom: 1px solid var(--dh-border-subtle);
    padding-bottom: 14px;
    .eyebrow {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      .red-mark { width: 8px; height: 8px; border-radius: 2px; background-color: var(--dh-brand); }
      .label { font-size: 13px; font-weight: 700; color: var(--dh-text-main); }
      .meta { font-size: 12px; color: var(--dh-text-secondary); }
    }
    .headline-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 34px; font-weight: 800; color: var(--dh-text-main); line-height: 1.2;
        .accent { color: var(--dh-brand); }
      }
    }
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
    @media (min-width: 860px) {
      grid-template-columns: repeat(2, 1fr);
      column-gap: 28px;
    }
  }

  .state-box {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .hero-refresh {
    background-color: var(--dh-bg-surface) !important;
  }

  .panel-footer {
    display: flex;
    justify-content: center;
    padding-top: 14px;
    margin-top: 10px;
    border-top: 1px solid var(--dh-border-subtle);
    .more-link {
      font-size: 14px; font-weight: 600; color: var(--dh-brand);
      .arrow { margin-left: 4px; transition: transform 0.2s; }
      &:hover .arrow { transform: translateX(4px); }
    }
  }

  @media (max-width: 768px) {
    padding: 16px 18px 14px;
    border-radius: 18px;
    margin-bottom: 18px;
    .masthead .headline-bar .title { font-size: 26px; }
  }
}
</style>
