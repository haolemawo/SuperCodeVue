import Layout from '@/layout'
// 系统管理
export const systemmanagers = {
  path: '/system',
  component: Layout,
  redirect: '/system/Rolelist',
  name: 'systemrolemanager',
  meta: { title: '系统管理', icon: 'example', affix: false, menuno: 'SYS_MANAGER' },
  children: [
    {
      path: 'DictionaryList',
      name: '数据字典',
      component: () => import('@/views/system/DictionaryList'),
      meta: { title: '数据字典', icon: 'table', menuno: 'SYS_DATADICTIONARY' }
    },
    {
      path: 'menu',
      name: '系统菜单',
      component: () => import('@/views/system/menu'),
      meta: { title: '系统菜单', icon: 'table', menuno: 'BASE_SYSTEMMENU' }
    },
    {
      path: 'SystemConfig',
      name: '系统配置',
      component: () => import('@/views/system/SystemConfig'),
      meta: { title: '系统配置', icon: 'table', menuno: 'BASE_SYSTEMCONFIG' }
    },
    {
      path: 'Rolelist',
      name: '角色管理',
      component: () => import('@/views/system/Rolelist'),
      meta: { title: '角色管理', icon: 'table', menuno: 'BASE_ROLEMANAGER' }
    },
    {
      path: 'RoleAuthorize',
      name: '角色授权',
      component: () => import('@/views/system/RoleAuthorize'),
      meta: { title: '角色授权', icon: 'table', menuno: 'BASE_ROLEAUTHORIZE' }
    },
    {
      path: 'HubChat',
      name: '在线客服',
      component: () => import('@/views/hubchat/onlinechat'),
      meta: { title: '在线客服', icon: 'table', menuno: 'WEB_ONLINESERVICE' }
    }
  ]
}

// 服务监控
export const systemmonitoring = {
  path: '/monitoring',
  component: Layout,
  redirect: '/monitoring/monitoring',
  name: 'systemrolemanager',
  meta: { title: '系统监控', icon: 'example', affix: false, menuno: 'SYS_SYSTEMMONITOGING' },
  children: [
    {
      path: 'monitoring',
      name: '服务监控',
      component: () => import('@/views/monitoring/monitoring'),
      meta: { title: '服务监控', icon: 'table', menuno: 'SYS_SERVERMONITORING' }
    },
    {
      path: 'onlineuser',
      name: '在线人员',
      component: () => import('@/views/monitoring/onlineuser'),
      meta: { title: '在线人员', icon: 'table', menuno: 'SYS_ONLINEUSER' }
    }
  ]
}
