<template>
  <div class="hero-panel" id="hot-list-douyin-parenting">
    <!-- 刊眉与刊头 -->
    <div class="masthead">
      <div class="eyebrow">
        <span class="red-mark" />
        <span class="label">抖音亲子日刊</span>
        <span class="meta" v-if="updateTime">共 {{ total }} 条 · {{ updateTime }}</span>
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

    <!-- 加载/错误状态 -->
    <div v-if="loadingError" class="state-box">
      <n-result size="small" status="500" title="热榜加载失败" description="请检查网络连接后重试" />
      <n-button secondary round size="small" @click="fetchData(true)">重试</n-button>
    </div>
    <div v-else-if="listLoading && !total" class="skeleton-wrap">
      <div class="skeleton-col" v-for="i in 2" :key="i">
        <n-skeleton v-for="j in 7" :key="j" height="30px" round style="margin-bottom: 6px" />
      </div>
    </div>

    <!-- 双分栏榜单：左 创作热点 / 右 亲子话题 -->
    <div v-else class="sections">
      <HeroBoardColumn
        title="创作热点"
        :subtitle="`上升热点 · ${spots.length} 条`"
        :rows="spotsShow"
        :max-hot="maxHot"
        :show-more="spots.length > HERO_SHOW"
        @more="goGroup('spot')"
      />
      <HeroBoardColumn
        title="亲子话题"
        :subtitle="`近 24h 播放 · ${topics.length} 条`"
        :rows="topicsShow"
        :max-hot="maxHot"
        :show-more="topics.length > HERO_SHOW"
        empty-text="暂无话题数据"
        @more="goGroup('topic')"
      />
    </div>

    <!-- 底部跳转更多 -->
    <div class="panel-footer">
      <n-button text class="more-link" @click="goGroup('all')">
        查看完整榜单 <span class="arrow">→</span>
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Refresh } from "@icon-park/vue-next";
import { useHotList } from "@/composables/useHotList";
import HeroBoardColumn from "@/components/HeroBoardColumn.vue";

const HERO_SHOW = 8;
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
} = useHotList("douyin-parenting");

const total = computed(() => hotListData.value?.data?.length || 0);

const spots = computed(() =>
  items.value.filter((i) => !i.kind || i.kind === "spot"),
);
const topics = computed(() => items.value.filter((i) => i.kind === "topic"));

const spotsShow = computed(() => spots.value.slice(0, HERO_SHOW));
const topicsShow = computed(() => topics.value.slice(0, HERO_SHOW));

const goGroup = (group) => {
  router.push({
    path: "/list",
    query: { type: "douyin-parenting", group },
  });
};

onMounted(() => initObserver("hot-list-douyin-parenting"));
</script>

<style lang="scss" scoped>
.hero-panel {
  background-color: var(--dh-brand-soft);
  border: 1px solid var(--dh-border-subtle);
  border-radius: var(--dh-radius-hero);
  box-shadow: var(--dh-shadow-md);
  padding: 20px 24px 14px;
  margin-bottom: 28px;
  transition: background-color 0.25s, border-color 0.25s;

  .masthead {
    margin-bottom: 14px;
    border-bottom: 1px solid var(--dh-border-subtle);
    padding-bottom: 12px;
    .eyebrow {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
      .red-mark { width: 8px; height: 8px; border-radius: 2px; background-color: var(--dh-brand); }
      .label { font-size: 13px; font-weight: 700; color: var(--dh-text-main); }
      .meta { font-size: 12px; color: var(--dh-text-secondary); }
    }
    .headline-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 32px; font-weight: 800; color: var(--dh-text-main); line-height: 1.2;
        .accent { color: var(--dh-brand); }
      }
    }
  }

  .hero-refresh {
    background-color: var(--dh-bg-surface) !important;
  }

  .state-box {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .skeleton-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 6px 0;
    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }

  .sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 28px;
    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }

  .panel-footer {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid var(--dh-border-subtle);
    .more-link {
      font-size: 14px; font-weight: 600; color: var(--dh-brand);
      .arrow { margin-left: 4px; transition: transform 0.2s; }
      &:hover .arrow { transform: translateX(4px); }
    }
  }

  @media (max-width: 768px) {
    padding: 16px 16px 12px;
    border-radius: 18px;
    margin-bottom: 18px;
    .masthead .headline-bar .title { font-size: 26px; }
  }
}
</style>
