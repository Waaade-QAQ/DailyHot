<template>
  <div class="list-page">
    <ListCategoryChips
      :categories="sortedNewsArr"
      :current-type="listType"
      @change="changeType"
    />

    <div class="list-card">
      <div class="card-header" v-if="listData">
        <div class="platform-meta">
          <div class="logo-box">
            <img :src="`/logo/${listType}.png`" :alt="listData.title" class="logo" />
          </div>
          <div class="title-wrap">
            <div class="title-row">
              <h1 class="main-title">{{ listData.title }}</h1>
              <span v-if="listData.total" class="total-badge">共 {{ listData.total }}</span>
            </div>
          </div>
        </div>
        <span class="time-text">{{ updateTime || '更新中...' }}</span>
      </div>

      <div v-if="loading" class="skeleton-wrap">
        <n-skeleton v-for="i in 10" :key="i" height="48px" round style="margin-bottom: 8px" />
      </div>
      <div v-else-if="listData?.data" class="list-content">
        <RankRow
          v-for="(item, index) in currentPageData"
          :key="item.url || index"
          :rank="index + 1 + (pageNumber - 1) * 20"
          :item="item"
          variant="list"
          :max-hot="maxHot"
        />
        <div class="pagination-bar">
          <n-pagination
            :page-slot="5"
            :item-count="listData.data.length"
            :page-size="20"
            v-model:page="pageNumber"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mainStore } from "@/store";
import { getHotLists } from "@/api";
import { formatTime } from "@/utils/getTime";
import { hotMax } from "@/utils/boardFormat";
import RankRow from "@/components/RankRow.vue";
import ListCategoryChips from "@/components/ListCategoryChips.vue";

const route = useRoute();
const router = useRouter();
const store = mainStore();

const listType = ref(route.query.type || "douyin-parenting");
const pageNumber = ref(Number(route.query.page) || 1);
const listData = ref(null);
const loading = ref(false);
const updateTime = ref("");

const sortedNewsArr = computed(() => {
  const visible = store.newsArr.filter((i) => i.show);
  const parenting = visible.filter((i) => i.name === "douyin-parenting");
  const rest = visible.filter((i) => i.name !== "douyin-parenting");
  return [...parenting, ...rest];
});

const currentPageData = computed(() => {
  if (!listData.value?.data) return [];
  const start = (pageNumber.value - 1) * 20;
  return listData.value.data.slice(start, start + 20);
});

const maxHot = computed(() => hotMax(currentPageData.value));

const fetchListData = async (type, isNew = false) => {
  loading.value = true;
  listData.value = null;
  const item = store.newsArr.find((i) => i.name === type) || { name: type };
  try {
    const res = await getHotLists(item.name, isNew, item.params);
    if (res?.code === 200) {
      listData.value = res;
      updateTime.value = formatTime(res.updateTime);
    } else if (window.$message) {
      window.$message.error(res?.message || "获取列表失败");
    }
  } catch (e) {
    if (window.$message) window.$message.error("获取列表异常");
  } finally {
    loading.value = false;
  }
};

const changeType = (type) => {
  if (type === listType.value) return;
  listType.value = type;
  pageNumber.value = 1;
  router.push({ path: "/list", query: { type, page: 1 } });
};

watch(() => route.query.type, (newType) => {
  if (newType && newType !== listType.value) {
    listType.value = newType;
    pageNumber.value = Number(route.query.page) || 1;
    fetchListData(newType);
  }
});

watch(() => pageNumber.value, (newPage) => {
  router.push({ path: "/list", query: { type: listType.value, page: newPage } });
  document.querySelector(".n-back-top")?.click();
});

watch(() => store.timeData, () => {
  if (listData.value?.updateTime) updateTime.value = formatTime(listData.value.updateTime);
});

fetchListData(listType.value);
</script>

<style lang="scss" scoped>
.list-page {
  padding-bottom: 32px;

  .list-card {
    background-color: var(--dh-bg-surface);
    border: 1px solid var(--dh-border-hairline);
    border-radius: var(--dh-radius-card);
    box-shadow: var(--dh-shadow-sm);
    padding: 24px 28px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--dh-border-hairline);
      margin-bottom: 12px;

      .platform-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        .logo-box {
          width: 38px; height: 38px; border-radius: 10px;
          background-color: var(--dh-bg-overlay);
          display: flex; align-items: center; justify-content: center;
          .logo { width: 26px; height: 26px; object-fit: contain; }
        }
        .title-row {
          display: flex; align-items: center; gap: 8px;
          .main-title { font-size: 20px; font-weight: 700; color: var(--dh-text-main); }
          .total-badge { font-size: 12px; color: var(--dh-text-muted); }
        }
      }
      .time-text { font-size: 12px; color: var(--dh-text-muted); }
    }

    .skeleton-wrap { padding: 12px 0; }
    .pagination-bar {
      display: flex; justify-content: center; margin-top: 24px; padding-top: 16px;
    }
  }
}
</style>
