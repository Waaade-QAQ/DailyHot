<template>
  <footer class="dh-footer">
    <div class="footer-inner">
      <div class="copyright">
        <n-text class="description" v-html="packageJson.description" />
        <n-text
          class="author"
          :depth="3"
          v-html="packageJson.author"
          @click="jumpLink(packageJson.github)"
        />
      </div>
      <n-text
        v-if="icp"
        :depth="3"
        class="icp"
        v-html="icp"
        @click="jumpLink('https://beian.miit.gov.cn/')"
      />
    </div>
  </footer>
</template>

<script setup>
import packageJson from "@/../package.json";

const icp = ref(import.meta.env.VITE_ICP || null);

const jumpLink = (url) => {
  if (url) window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<style lang="scss" scoped>
.dh-footer {
  height: var(--dh-footer-h);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  background-color: transparent;

  .footer-inner {
    max-width: 1360px;
    width: 100%;
    padding: 0 clamp(16px, 4vw, 48px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .copyright {
    display: flex;
    align-items: center;
    font-size: 13px;
    .description::after {
      content: "@ Copyright By";
      margin: 0 6px;
    }
  }

  .author,
  .icp {
    cursor: pointer;
    font-size: 12px;
    transition: color 0.2s;
    &:hover {
      color: var(--dh-brand);
    }
  }
}
</style>
