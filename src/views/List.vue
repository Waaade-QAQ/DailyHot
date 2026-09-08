<template>
  <div class="list-page">
    <ListCategoryChips
      :categories="sortedNewsArr"
      :current-type="listType"
      @change="changeType"
    />

    <div class="list-card">
      <ListHeader
        v-if="listData"
        :name="listType"
        :title="listData.title"
        :total="listData.total"
        :update-text="updateTime"
      />

      <GroupTabs
        v-if="isParentingList && hasKind"
        :options="groupOptions"
        :current="groupKind"
        @change="changeGroup"
      />

      <div v-if="loading" class="skeleton-wrap">
        <n-skeleton v-for="i in 10" :key="i" height="48px" round style="margin-bottom: 8px" />
      </div>
      <div v-else-if="listData?.data" class="list-content">
        <RankRow
          v-for="(item, index) in currentPageData"
          :key="`${item.kind || 'x'}-${item.id || index}`"
          :rank="index + 1 + (pageNumber - 1) * PAGE_SIZE"
          :item="item"
          variant="list"
          :max-hot="maxHot"
        />
        <div class="pagination-bar" v-if="groupRows.length > PAGE_SIZE">
          <n-pagination
            :page-slot="5"
            :item-count="groupRows.length"
            :page-size="PAGE_SIZE"
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
import ListHeader from "@/components/ListHeader.vue";
import GroupTabs from "@/components/GroupTabs.vue";

const PAGE_SIZE = 20;
const route = useRoute();
const router = useRouter();
const store = mainStore();

const listType = ref(route.query.type || "douyin-parenting");
const pageNumber = ref(Number(route.query.page) || 1);
const groupKind = ref(["spot", "topic"].includes(route.query.group) ? route.query.group : "all");
const listData = ref(null);
const loading = ref(false);
const updateTime = ref("");

const groupOptions = [
  { label: "全部", value: "all" },
  { label: "创作热点", value: "spot" },
  { label: "亲子话题", value: "topic" },
];

const isParentingList = computed(() => listType.value === "douyin-parenting");
const hasKind = computed(() => listData.value?.data?.some((i) => i.kind));

const sortedNewsArr = computed(() => {
  const visible = store.newsArr.filter((i) => i.show);
  const parenting = visible.filter((i) => i.name === "douyin-parenting");
  const rest = visible.filter((i) => i.name !== "douyin-parenting");
  return [...parenting, ...rest];
});

const groupRows = computed(() => {
  const all = listData.value?.data || [];
  if (groupKind.value === "topic") return all.filter((i) => i.kind === "topic");
  if (groupKind.value === "spot") return all.filter((i) => !i.kind || i.kind === "spot");
  return all;
});

const currentPageData = computed(() => {
  const start = (pageNumber.value - 1) * PAGE_SIZE;
  return groupRows.value.slice(start, start + PAGE_SIZE);
});

const maxHot = computed(() => hotMax(currentPageData.value));

const pushQuery = (extra = {}) => {
  const query = {
    type: listType.value,
    page: pageNumber.value,
    ...(groupKind.value !== "all" ? { group: groupKind.value } : {}),
    ...extra,
  };
  router.push({ path: "/list", query });
};

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
  groupKind.value = "all";
  pageNumber.value = 1;
  fetchListData(type);
  pushQuery();
};

const changeGroup = (group) => {
  if (group === groupKind.value) return;
  groupKind.value = group;
  pageNumber.value = 1;
  pushQuery();
};

watch(
  () => route.query.type,
  (newType) => {
    if (newType && newType !== listType.value) {
      listType.value = newType;
      groupKind.value = "all";
      pageNumber.value = Number(route.query.page) || 1;
      fetchListData(newType);
    }
  }
);

watch(
  () => route.query.group,
  (group) => {
    const next = ["spot", "topic"].includes(group) ? group : "all";
    if (next !== groupKind.value && listType.value === "douyin-parenting") {
      groupKind.value = next;
      pageNumber.value = 1;
    }
  }
);

watch(pageNumber, () => {
  pushQuery();
  document.querySelector(".n-back-top")?.click();
});

watch(
  () => store.timeData,
  () => {
    if (listData.value?.updateTime) updateTime.value = formatTime(listData.value.updateTime);
  }
);

fetchListData(listType.value);
</script>

<style lang="scss" scoped>
.list-page { padding-bottom: 32px;
  .list-card {
    background-color: var(--dh-bg-surface);
    border: 1px solid var(--dh-border-hairline);
    border-radius: var(--dh-radius-card);
    box-shadow: var(--dh-shadow-sm);
    padding: 24px 28px;

    .skeleton-wrap { padding: 12px 0; }
    .pagination-bar { display: flex; justify-content: center; margin: 24px 0 0; padding-top: 16px; }
  }
}
</style>
