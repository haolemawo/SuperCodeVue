/**
 * api接口的统一出口
 */
// 用户登录、权限接口
import user from '@/api/user'

// 系统设置模块
// 角色管理
import role from '@/api/system/role'

// 导出接口
export default {
  user,
  role
}
