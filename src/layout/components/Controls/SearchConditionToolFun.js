/**
 * 当前 js 是从 SearchConditionToolbar.vue 控件中独立出来一些帮助方法
 * 用于界面自定义组装参数获得加密字符串
 */
const Base64 = require('js-base64').Base64
export function getFilterStr(filters) {
  let result = ''
  if (filters.length > 0) {
    result = Base64.encode(filters)
  }
  return result
}
