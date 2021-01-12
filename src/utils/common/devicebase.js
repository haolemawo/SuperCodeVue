// 获取当前浏览器
export function GetCurrentBrowser() {
  const ua = navigator.userAgent.toLocaleLowerCase()
  let browserType = null
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browserType = 'IE'
  } else if (ua.match(/firefox/) != null) {
    browserType = 'Firefox'
  } else if (ua.match(/ucbrowser/) != null) {
    browserType = 'UC'
  } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
    browserType = 'Opera'
  } else if (ua.match(/bidubrowser/) != null) {
    browserType = 'Baidu'
  } else if (ua.match(/metasr/) != null) {
    browserType = 'Sougou'
  } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
    browserType = 'QQ'
  } else if (ua.match(/maxthon/) != null) {
    browserType = 'Maxthon'
  } else if (ua.match(/chrome/) != null) {
    var is360 = _mime('type', 'application/vnd.chromium.remoting-viewer')
    if (is360) {
      browserType = '360'
    } else {
      browserType = 'Chrome'
    }
  } else if (ua.match(/safari/) != null) {
    browserType = 'Safari'
  } else {
    browserType = 'Others'
  }
  return browserType
}

function _mime(option, value) {
  var mimeTypes = navigator.mimeTypes
  for (var mt in mimeTypes) {
    if (mimeTypes[mt][option] === value) {
      return true
    }
  }
  return false
}

// 获取操作系统
export function GetOs() {
  const sUserAgent = navigator.userAgent.toLocaleLowerCase()
  const isWin = (navigator.platform === 'win32') || (navigator.platform === 'windows')
  const isMac = (navigator.platform === 'mac68k') || (navigator.platform === 'macppc') || (navigator.platform === 'macintosh') || (navigator.platform === 'macintel')
  if (isMac) return 'Mac'
  var isUnix = (navigator.platform === 'x11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  var isLinux = (String(navigator.platform).indexOf('linux') > -1)
  if (isLinux) return 'Linux'
  if (isWin) {
    var isWin2K = sUserAgent.indexOf('windows nt 5.0') > -1 || sUserAgent.indexOf('windows 2000') > -1
    if (isWin2K) return 'Win2000'
    var isWinXP = sUserAgent.indexOf('windows nt 5.1') > -1 || sUserAgent.indexOf('windows xp') > -1
    if (isWinXP) return 'WinXP'
    var isWin2003 = sUserAgent.indexOf('windows nt 5.2') > -1 || sUserAgent.indexOf('windows 2003') > -1
    if (isWin2003) return 'Win2003'
    var isWinVista = sUserAgent.indexOf('windows nt 6.0') > -1 || sUserAgent.indexOf('windows vista') > -1
    if (isWinVista) return 'WinVista'
    var isWin7 = sUserAgent.indexOf('windows nt 6.1') > -1 || sUserAgent.indexOf('windows 7') > -1
    if (isWin7) return 'Win7'
  }
  if (sUserAgent.indexOf('android') > -1) return 'Android'
  if (sUserAgent.indexOf('iphone') > -1) return 'iPhone'
  if (sUserAgent.indexOf('symbianos') > -1) return 'SymbianOS'
  if (sUserAgent.indexOf('windows phone') > -1) return 'Windows Phone'
  if (sUserAgent.indexOf('ipad') > -1) return 'iPad'
  if (sUserAgent.indexOf('ipod') > -1) return 'iPod'
  if (sUserAgent.indexOf('windows') > -1) return 'Windows'
  if (sUserAgent.indexOf('mac ox x') > -1) return 'Mac'
  if (sUserAgent.indexOf('linux') > -1) return 'Linux'
  return 'others'
}
