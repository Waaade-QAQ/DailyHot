<template>
  <div class="home-page">
    <!-- 主榜 Hero 面板：抖音亲子 -->
    <HeroPanel v-if="showHero" />

    <!-- 次要榜单卡片墙 -->
    <n-grid
      v-if="secondaryList.length"
      cols="1 600:2 980:3 1260:4 1560:5"
      :x-gap="24"
      :y-gap="24"
    >
      <n-grid-item
        v-for="(item, index) in secondaryList"
        :key="item.name"
        class="card-item"
        :style="{ animationDelay: `${(index % 12) * 0.05 + 0.1}s` }"
      >
        <SecondaryBoardCard :hot-data="item" />
      </n-grid-item>
    </n-grid>

    <!-- 兜底重置提示 -->
    <div v-else-if="!showHero" class="empty-state">
      <n-divider dashed class="tip">此处暂无已启用的榜单</n-divider>
      <n-space justify="center">
        <n-button size="large" secondary round @click="resetSite">
          出错了？点此重置
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { mainStore } from "@/store";
import HeroPanel from "@/components/HeroPanel.vue";
import SecondaryBoardCard from "@/components/SecondaryBoardCard.vue";

const store = mainStore();

const showHero = computed(() => {
  return store.newsArr.some((i) => i.name === "douyin-parenting" && i.show);
});

const secondaryList = computed(() => {
  return store.newsArr.filter((i) => i.show && i.name !== "douyin-parenting");
});

const resetSite = () => {
  if (window.$dialog) {
    window.$dialog.warning({
      title: "重置站点",
      content: "确认重置站点？你的自定义数据将会恢复为默认状态！",
      positiveText: "重置",
      negativeText: "取消",
      onPositiveClick: () => {
        if (window.$timeInterval) clearInterval(window.$timeInterval);
        localStorage.clear();
        location.reload();
      },
    });
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 24px;

  .card-item {
    opacity: 0;
    transform: translateY(16px);
    animation: cardAppear 0.35s cubic-bezier(0.2, 0, 0.2, 1) forwards;
  }

  .empty-state {
    padding: 60px 0;
    .tip {
      font-size: 18px;
      color: var(--dh-text-muted);
      margin-bottom: 24px;
    }
  }
}

@keyframes cardAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
