import { ref, computed, watch, onBeforeUnmount } from "vue";
import { getHotLists } from "@/api";
import { formatTime } from "@/utils/getTime";
import { hotMax } from "@/utils/boardFormat";
import { mainStore } from "@/store";

/**
 * 榜单数据胶囊 Hook
 * @param {string} boardName 榜单唯一标识
 * @param {object} options
 */
export function useHotList(boardName, options = {}) {
  const store = mainStore();
  const hotListData = ref(null);
  const listLoading = ref(false);
  const loadingError = ref(false);
  const updateTime = ref("");
  const scrollbarRef = ref(null);
  let observer = null;

  const lastClickTime = ref(
    Number(localStorage.getItem(`${boardName}Btn`)) || 0
  );

  const items = computed(() => {
    if (!hotListData.value?.data) return [];
    const limit = options.limit || 0;
    return limit > 0 ? hotListData.value.data.slice(0, limit) : hotListData.value.data;
  });

  const maxHot = computed(() => hotMax(items.value));

  const findBoard = (name) => {
    return (
      store.newsArr.find((i) => i.name === name) ||
      store.defaultNewsArr.find((i) => i.name === name) ||
      { name }
    );
  };

  const fetchData = async (isNew = false) => {
    if (hotListData.value && !isNew) return;
    try {
      loadingError.value = false;
      listLoading.value = true;
      const board = findBoard(boardName);
      const res = await getHotLists(board.name, isNew, board.params);
      if (res && res.code === 200) {
        hotListData.value = res;
        updateTime.value = formatTime(res.updateTime);
        listLoading.value = false;
        if (scrollbarRef.value) {
          scrollbarRef.value.scrollTo({ position: "top", behavior: "smooth" });
        }
      } else {
        loadingError.value = true;
        listLoading.value = false;
        const msg = res ? `${res.title || ""}${res.message || "加载失败"}` : "加载失败";
        if (window.$message) window.$message.error(msg);
      }
    } catch (e) {
      loadingError.value = true;
      listLoading.value = false;
      if (window.$message) window.$message.error("热榜加载失败，请重试");
    }
  };

  const getNewData = () => {
    const now = Date.now();
    if (now - lastClickTime.value < 60000) {
      if (window.$message) window.$message.info("请稍后再刷新");
      return;
    }
    lastClickTime.value = now;
    localStorage.setItem(`${boardName}Btn`, now.toString());
    fetchData(true);
  };

  const cleanObserver = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const initObserver = (domId) => {
    const targetId = domId || `hot-list-${boardName}`;
    const el = document.getElementById(targetId);
    if (!el) {
      fetchData();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchData();
          if (observer) observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(el);
  };

  watch(
    () => store.timeData,
    () => {
      if (hotListData.value?.updateTime) {
        updateTime.value = formatTime(hotListData.value.updateTime);
      }
    }
  );

  onBeforeUnmount(() => {
    cleanObserver();
  });

  return {
    hotListData,
    items,
    maxHot,
    listLoading,
    loadingError,
    updateTime,
    scrollbarRef,
    fetchData,
    getNewData,
    initObserver,
    cleanObserver,
  };
}
