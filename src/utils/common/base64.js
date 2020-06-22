const Base64 = require('js-base64').Base64

// base64 加密
export function encode(str) {
  return Base64.encode(str)
}
// base64 解密
export function decode(baseStr) {
  return Base64.decode(baseStr)
}
