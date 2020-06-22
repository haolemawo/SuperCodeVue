/**
 * 根据URL，获取路由信息
 * @param {地址栏Url} url
 */
export function GetUrlRelativePath(url) {
  var arrUrl = url.split('//')
  var start = arrUrl[1].indexOf('/')
  var relUrl = arrUrl[1].substring(start)

  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0]
  }
  return relUrl
}
