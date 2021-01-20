import Layout from '@/layout'

// 人员管理
export const UserManager =
{
  path: '/baseinfo',
  component: Layout,
  redirect: '/baseinfo/userlist',
  name: '人员管理',
  meta: { title: '基础信息', icon: 'example', affix: false, menuno: 'BASE_INFOMANAGER' },
  children: [
    {
      path: 'userlist',
      name: '用户管理',
      component: () => import('@/views/baseinfo/userlist/index'),
      meta: { title: '用户管理', icon: 'table', menuno: 'BASE_USERINFO' }
    }
  ]
}

// 组织架构
export const Organization =
{
  path: '/organization',
  component: Layout,
  redirect: '/organization/dept',
  name: '组织架构',
  meta: { title: '组织架构', icon: 'example', affix: false, menuno: 'SYS_ORGANIZATION' },
  children: [
    {
      path: 'deptmanager',
      name: '部门管理',
      component: () => import('@/views/organization/dept'),
      meta: { title: '部门管理', icon: 'table', menuno: 'SYS_DEPTMANAGER' }
    }
  ]
}
