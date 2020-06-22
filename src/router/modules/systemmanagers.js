import Layout from '@/layout'

const systemmanagers = {
  path: '/system',
  component: Layout,
  redirect: '/system/Rolelist',
  name: 'systemrolemanager',
  alwaysShow: true,
  meta: { title: '系统管理', icon: 'example', affix: true, menuno: 'SYS_MANAGER' },
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
      meta: { title: '在线客服', icon: 'table', menuno: 'HubChat' }
    }
  ]
}

export default systemmanagers
