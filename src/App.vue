<template>
  <Provider>
    <n-layout
      embedded
      :native-scrollbar="false"
      class="app-layout"
      :class="{ fixed: store.headerFixed }"
    >
      <n-back-top :visibility-height="120" />
      <Header />
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <transition name="scale" mode="out-in">
              <component :is="Component" />
            </transition>
          </keep-alive>
        </router-view>
      </main>
      <Footer />
    </n-layout>
  </Provider>
</template>

<script setup>
import { mainStore } from "@/store";
import Provider from "@/components/Provider.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const store = mainStore();

onMounted(() => {
  store.checkNewsUpdate();
  nextTick(() => {
    if (store.newsArr.length === 0) {
      store.newsArr = store.defaultNewsArr;
    }
  });
});
</script>

<style lang="scss" scoped>
.app-layout {
  height: 100%;
  background-color: transparent;

  :deep(.n-scrollbar-rail) {
    right: 2px;
    top: 0;
    bottom: 0;
    z-index: 101;
  }

  .app-main {
    max-width: 1360px;
    width: 100%;
    margin: 0 auto;
    padding: 20px clamp(16px, 4vw, 48px) 0;
    min-height: calc(100vh - var(--dh-header-h) - var(--dh-footer-h) - 44px);
    box-sizing: border-box;

    @media (max-width: 768px) {
      padding: 12px clamp(12px, 3vw, 24px) 0;
      min-height: calc(100vh - var(--dh-header-h-mobile) - var(--dh-footer-h) - 36px);
    }
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.99);
}
</style>
