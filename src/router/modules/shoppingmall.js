import Layout from '@/layout'

// 商城模块
const shoppingmall = {
  path: '/shopping',
  component: Layout,
  redirect: '/shopping/malllist',
  name: 'shopping',
  alwaysShow: true,
  meta: { title: '商城管理', icon: 'shopping', affix: true, menuno: 'SM_SHOPPINGMALLMANAGER' },
  children: [
    {
      path: 'malllist',
      name: '商品列表',
      component: () => import('@/views/shopping/malllist'),
      meta: { title: '商品列表', icon: 'table', menuno: 'SM_SHOPPINGPRODUCTLIST' }
    },
    {
      path: 'malltype',
      name: '商品分类',
      component: () => import('@/views/shopping/malltype'),
      meta: { title: '商品分类', icon: 'table', menuno: 'SM_SHOPPINGPRODUCTTYPE' }
    },
    {
      path: 'brandmanager',
      name: '品牌管理',
      component: () => import('@/views/shopping/brandmanager'),
      meta: { title: '品牌管理', icon: 'table', menuno: 'SM_SHOPPINGBRANDMANAGER' }
    }
  ]
}

export default shoppingmall
