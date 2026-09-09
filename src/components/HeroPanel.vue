<template>
  <div class="hero-panel" id="hot-list-douyin-parenting">
    <!-- 刊眉与刊头 -->
    <HeroMasthead :total="total" :update-text="updateTime" @refresh="getNewData" />

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

    <!-- 双分栏：左 = 实时热搜 + 创作热点（5+5），右 = 亲子话题 -->
    <div v-else class="sections">
      <div class="left-stack">
        <HeroBoardColumn
          title="实时热搜"
          :subtitle="`官方 · 分钟级更新`"
          :rows="officialShow"
          :max-hot="maxHot"
          :show-more="officialRows.length > HERO_GROUP"
          empty-text="暂无热搜数据"
          @more="goGroup('spot')"
        />
        <HeroBoardColumn
          title="创作热点"
          :subtitle="`创作者中心 · 每日快照`"
          :rows="creatorShow"
          :max-hot="maxHot"
          :show-more="creatorRows.length > HERO_GROUP"
          empty-text="暂无创作热点"
          @more="goGroup('spot')"
        />
      </div>
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
import { useHotList } from "@/composables/useHotList";
import HeroBoardColumn from "@/components/HeroBoardColumn.vue";
import HeroMasthead from "@/components/HeroMasthead.vue";

const HERO_SHOW = 10;
const HERO_GROUP = 5;
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

// spot 按来源分组：rest（升级前无 source 的兜底）归入实时热搜
const officialRows = computed(() =>
  items.value.filter((i) => !i.kind || (i.kind === "spot" && i.source !== "creator")),
);
const creatorRows = computed(() =>
  items.value.filter((i) => i.kind === "spot" && i.source === "creator"),
);
const topics = computed(() => items.value.filter((i) => i.kind === "topic"));

const officialShow = computed(() => officialRows.value.slice(0, HERO_GROUP));
const creatorShow = computed(() => creatorRows.value.slice(0, HERO_GROUP));
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

  .left-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
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
  }
}
</style>
