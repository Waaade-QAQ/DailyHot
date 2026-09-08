<template>
  <header class="dh-header" :class="{ fixed: store.headerFixed }">
    <div class="header-inner">
      <div class="logo" @click="router.push('/')">
        <img src="/ico/favicon.png" alt="logo" class="logo-img" />
        <div class="name">
          <span class="title">今日热榜</span>
          <span class="desc">汇聚全网热点，热门尽览无余</span>
        </div>
      </div>
      <div class="center-time" v-if="store.timeData">
        <span class="time">{{ store.timeData.time.text }}</span>
        <span class="date">
          {{ `${store.timeData.lunar.GanZhiYear}年 ${store.timeData.lunar.text} ${store.timeData.time.weekday}` }}
        </span>
      </div>
      <div class="controls desktop-controls">
        <n-space :size="10">
          <n-tooltip v-if="showRefresh">
            <template #trigger>
              <n-button secondary strong round size="small" @click="router.go(0)">
                <template #icon><n-icon :component="Refresh" /></template>
              </n-button>
            </template>
            刷新页面
          </n-tooltip>
          <n-tooltip>
            <template #trigger>
              <n-button
                secondary strong round size="small"
                @click="store.setSiteTheme(store.siteTheme === 'light' ? 'dark' : 'light')"
              >
                <template #icon>
                  <n-icon :component="store.siteTheme === 'light' ? Moon : SunOne" />
                </template>
              </n-button>
            </template>
            {{ store.siteTheme === "light" ? "深色模式" : "浅色模式" }}
          </n-tooltip>
          <n-tooltip>
            <template #trigger>
              <n-button secondary strong round size="small" @click="router.push('/setting')">
                <template #icon><n-icon :component="SettingTwo" /></template>
              </n-button>
            </template>
            全局设置
          </n-tooltip>
        </n-space>
      </div>
      <div class="mobile-controls">
        <n-dropdown
          :options="menuOptions"
          size="large"
          trigger="click"
          placement="bottom-end"
          @select="menuOptionsSelect"
        >
          <n-button secondary strong round size="small">
            <template #icon><n-icon :component="HamburgerButton" /></template>
          </n-button>
        </n-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { SunOne, Moon, Refresh, SettingTwo, HamburgerButton } from "@icon-park/vue-next";
import { getCurrentTime } from "@/utils/getTime.js";
import { mainStore } from "@/store";
import { NText, NIcon } from "naive-ui";
import { useRouter } from "vue-router";

const router = useRouter();
const store = mainStore();
const timeInterval = ref(null);
const showRefresh = ref(false);

const timeRender = () => h("div", { class: "mobile-time-card" }, [
  h(NText, null, { default: () => (store.timeData ? store.timeData.time.text : "时间获取中") }),
  h(NText, { depth: 3, style: "font-size: 12px; margin-top: 2px" }, {
    default: () => store.timeData
      ? `${store.timeData.lunar.GanZhiYear}年 ${store.timeData.lunar.text} ${store.timeData.time.weekday}`
      : "日期获取中",
  }),
]);

const menuOptions = computed(() => [
  { key: "header", type: "render", render: timeRender },
  { key: "header-divider", type: "divider" },
  { label: "刷新页面", key: "refresh", icon: () => h(NIcon, null, { default: () => h(Refresh) }) },
  {
    label: () => h(NText, null, { default: () => (store.siteTheme === "light" ? "深色模式" : "浅色模式") }),
    key: "changeTheme",
    icon: () => h(NIcon, null, { default: () => (store.siteTheme === "light" ? h(Moon) : h(SunOne)) }),
  },
  { label: "全局设置", key: "setting", icon: () => h(NIcon, null, { default: () => h(SettingTwo) }) },
]);

const menuOptionsSelect = (val) => {
  if (val === "refresh") router.go(0);
  else if (val === "changeTheme") store.setSiteTheme(store.siteTheme === "light" ? "dark" : "light");
  else if (val === "setting") router.push("/setting");
};

watch(() => router.currentRoute.value?.path, (path) => { showRefresh.value = path === "/"; }, { immediate: true });

onMounted(() => {
  window.$timeInterval = timeInterval.value = setInterval(() => { store.timeData = getCurrentTime(); }, 1000);
});

onBeforeUnmount(() => {
  if (timeInterval.value) clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.dh-header {
  height: var(--dh-header-h);
  width: 100%;
  transition: background-color 0.25s, border-color 0.25s;
  &.fixed {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background-color: var(--dh-header-bg);
    border-bottom: 1px solid var(--dh-header-border);
  }
  .header-inner {
    max-width: 1360px;
    height: 100%;
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 48px);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    .logo-img { width: 34px; height: 34px; border-radius: 8px; }
    .name {
      display: flex;
      flex-direction: column;
      .title { font-size: 17px; font-weight: 700; color: var(--dh-text-main); }
      .desc { font-size: 11px; color: var(--dh-text-muted); }
    }
  }
  .center-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    .time { font-size: 13px; font-weight: 600; color: var(--dh-text-secondary); }
    .date { font-size: 11px; color: var(--dh-text-muted); }
  }
  .mobile-controls { display: none; }
  @media (max-width: 768px) {
    height: var(--dh-header-h-mobile);
    .name .desc, .center-time, .desktop-controls { display: none; }
    .mobile-controls { display: block; }
  }
}
:deep(.mobile-time-card) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
}
</style>
