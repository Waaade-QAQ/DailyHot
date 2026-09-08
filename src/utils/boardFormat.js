/**
 * 热度数据解析与格式化纯函数
 */

/**
 * 解析各种热度格式为纯数字
 * @param {string|number} val
 * @returns {number}
 */
export const parseHot = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") return isNaN(val) || val < 0 ? 0 : val;
  const str = String(val).trim().replace(/,/g, "");
  if (!str) return 0;
  if (/^[\d.]+\s*亿$/.test(str)) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.round(num * 1e8);
  }
  if (/^[\d.]+\s*万$/.test(str)) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.round(num * 1e4);
  }
  const directNum = parseFloat(str);
  return isNaN(directNum) || directNum < 0 ? 0 : directNum;
};

/**
 * 格式化热度文本
 * ≥1e8 → 留2位+去尾零+亿；≥1e4 → 留1位+去尾零+万；<10000 整数原样（无千分位）；0/非法 → —
 * @param {string|number} val
 * @returns {string}
 */
export const formatHot = (val) => {
  const num = parseHot(val);
  if (num <= 0) return "—";
  if (num >= 1e8) {
    const s = (num / 1e8).toFixed(2).replace(/\.?0+$/, "");
    return `${s}亿`;
  }
  if (num >= 1e4) {
    const s = (num / 1e4).toFixed(1).replace(/\.?0+$/, "");
    return `${s}万`;
  }
  return Math.round(num).toString();
};

export const toHotNumber = formatHot;

/**
 * 计算一组条目中的最大热度
 * @param {Array<{ hot?: string|number }>} list
 * @returns {number}
 */
export const hotMax = (list) => {
  if (!Array.isArray(list) || list.length === 0) return 0;
  let max = 0;
  for (let i = 0; i < list.length; i++) {
    const val = parseHot(list[i]?.hot);
    if (val > max) max = val;
  }
  return max;
};

/**
 * 计算相对热力条百分比（下限 3% 视觉刻度）
 * @param {string|number} hot
 * @param {number} max
 * @returns {number}
 */
export const heatPct = (hot, max) => {
  const val = parseHot(hot);
  if (val <= 0 || !max || max <= 0) return 0;
  const pct = Math.round((val / max) * 100);
  return Math.max(3, Math.min(100, pct));
};
