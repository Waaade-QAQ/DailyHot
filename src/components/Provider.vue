<!-- 全局配置组件 -->
<template>
  <n-config-provider
    abstract
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :theme-overrides="currentThemeOverrides"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider :max="1">
            <slot></slot>
            <NaiveProviderContent />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {
  zhCN,
  dateZhCN,
  darkTheme,
  useOsTheme,
  useLoadingBar,
  useDialog,
  useMessage,
  useNotification,
} from "naive-ui";
import { mainStore } from "@/store";
import { lightThemeOverrides, darkThemeOverrides } from "@/style/naive-theme";

const store = mainStore();
const osThemeRef = useOsTheme();

const theme = ref(null);
const currentThemeOverrides = computed(() =>
  store.siteTheme === "dark" ? darkThemeOverrides : lightThemeOverrides
);

const applyTheme = (mode) => {
  theme.value = mode === "dark" ? darkTheme : null;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = mode;
  }
};

const osThemeChange = (val) => {
  if (store.siteThemeAuto) {
    store.siteTheme = val === "dark" ? "dark" : "light";
  }
};

watch(
  () => store.siteTheme,
  (val) => {
    applyTheme(val);
  },
  { immediate: true }
);

watch(
  () => osThemeRef.value,
  (val) => {
    osThemeChange(val);
  }
);

provide("themeOverrides", currentThemeOverrides);

const setupNaiveTools = () => {
  window.$loadingBar = useLoadingBar();
  window.$notification = useNotification();
  window.$message = useMessage();
  window.$dialog = useDialog();
};

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools();
  },
  render() {
    return h("div", {
      class: {
        tools: true,
      },
    });
  },
});

onMounted(() => {
  osThemeChange(osThemeRef.value);
  applyTheme(store.siteTheme);
});
</script>
