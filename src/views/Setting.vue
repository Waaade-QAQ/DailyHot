<template>
  <div class="setting-page">
    <h1 class="page-title">全局设置</h1>

    <!-- 基础设置 -->
    <div class="section-title">基础偏好</div>

    <SettingSwitchRow title="明暗模式" description="手动切换网站日间浅色或夜间暖黑外观">
      <n-select
        class="control-select"
        v-model:value="siteTheme"
        :options="themeOptions"
        @update:value="siteThemeAuto = false"
      />
    </SettingSwitchRow>

    <SettingSwitchRow title="跟随系统" description="根据系统明暗模式自动切换">
      <n-switch v-model:value="siteThemeAuto" @update:value="handleAutoTheme" />
    </SettingSwitchRow>

    <SettingSwitchRow title="链接跳转方式" description="选择点击热榜条目时的打开方式">
      <n-select class="control-select" v-model:value="linkOpenType" :options="linkOptions" />
    </SettingSwitchRow>

    <SettingSwitchRow title="固定导航栏" description="页面滚动时顶栏常驻吸顶">
      <n-switch v-model:value="headerFixed" />
    </SettingSwitchRow>

    <SettingSwitchRow vertical title="列表文字字号" description="调整热榜列表字体大小（14px - 20px）">
      <div class="font-preview" :style="{ fontSize: `${listFontSize}px` }">
        文字预览：母婴爆款热点追踪，热门尽览无余
      </div>
      <n-slider
        v-model:value="listFontSize"
        :tooltip="false"
        :max="20"
        :min="14"
        :step="1"
        :marks="{ 14: '紧凑 (14px)', 16: '默认 (16px)', 20: '清晰 (20px)' }"
      />
    </SettingSwitchRow>

    <!-- 榜单排序与显隐 -->
    <div class="section-title">内容编排</div>
    <SettingBoardList
      :news-arr="newsArr"
      @restore="restoreDefault"
      @update-order="saveOrder"
      @toggle="handleToggle"
    />

    <!-- 数据重置 -->
    <div class="section-title">数据管理</div>
    <SettingSwitchRow title="重置站点数据" description="清空所有本地缓存与偏好设置，恢复出厂默认">
      <n-popconfirm @positive-click="resetAll">
        <template #trigger>
          <n-button type="error" secondary round size="small">重置所有</n-button>
        </template>
        确认重置所有数据？您的自定义排序与偏好都将恢复为默认！
      </n-popconfirm>
    </SettingSwitchRow>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useOsTheme } from "naive-ui";
import { mainStore } from "@/store";
import SettingSwitchRow from "@/components/SettingSwitchRow.vue";
import SettingBoardList from "@/components/SettingBoardList.vue";

const store = mainStore();
const osThemeRef = useOsTheme();
const {
  siteTheme,
  siteThemeAuto,
  newsArr,
  linkOpenType,
  headerFixed,
  listFontSize,
} = storeToRefs(store);

const themeOptions = [
  { label: "浅色模式（暖白）", value: "light" },
  { label: "深色模式（暖黑）", value: "dark" },
];

const linkOptions = [
  { label: "新标签页打开", value: "open" },
  { label: "当前页打开", value: "href" },
];

const handleAutoTheme = (val) => {
  if (val && osThemeRef.value) {
    siteTheme.value = osThemeRef.value;
  }
};

const restoreDefault = () => {
  newsArr.value = [...newsArr.value].sort((a, b) => a.order - b.order);
  if (window.$message) window.$message.success("已恢复默认榜单排序");
};

const saveOrder = () => {
  if (window.$message) window.$message.success("榜单排序已保存");
};

const handleToggle = ({ label, show }) => {
  if (window.$message) {
    window.$message.success(`${label}榜单已${show ? "开启" : "关闭"}`);
  }
};

const resetAll = () => {
  if (window.$timeInterval) clearInterval(window.$timeInterval);
  localStorage.clear();
  location.reload();
};
</script>

<style lang="scss" scoped>
.setting-page {
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 40px;

  .page-title {
    font-size: 28px;
    font-weight: 800;
    color: var(--dh-text-main);
    margin-bottom: 24px;
    letter-spacing: -0.5px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--dh-text-secondary);
    margin: 20px 0 10px 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .control-select {
    width: 160px;
  }

  .font-preview {
    padding: 10px 14px;
    background-color: var(--dh-bg-overlay);
    border: 1px solid var(--dh-border-hairline);
    border-radius: 8px;
    margin-bottom: 16px;
    color: var(--dh-text-main);
    transition: font-size 0.2s;
  }
}
</style>
