/**
 * 链接跳转与路由导航辅助函数
 */

/**
 * 打开热点链接（根据设备宽度选择 url / mobileUrl，根据设置选择 open / href）
 * @param {object} item
 * @param {string} linkOpenType 'open' | 'href'
 */
export const openHotLink = (item, linkOpenType = "open") => {
  if (!item) return;
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 680;
  const targetUrl = isMobile && item.mobileUrl ? item.mobileUrl : (item.url || item.mobileUrl);
  if (!targetUrl) {
    if (typeof window !== "undefined" && window.$message) {
      window.$message.error("链接不存在");
    }
    return;
  }
  if (linkOpenType === "href") {
    window.location.href = targetUrl;
  } else {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }
};

/**
 * 跳转至指定分类的热榜列表页
 * @param {object} router vue-router 实例
 * @param {string} name 平台标识
 * @param {number|string} page 页码（默认为 1）
 */
export const goList = (router, name, page = 1) => {
  if (!router || !name) return;
  router.push({
    path: "/list",
    query: {
      type: name,
      page: Number(page) || 1,
    },
  });
};
