import Layout from '@/layout'

// 商城模块
export const shoppingmall = {
  path: '/shopping',
  component: Layout,
  redirect: '/shopping/malllist',
  name: 'shopping',
  meta: { title: '商城管理', icon: 'shopping', affix: false, menuno: 'SM_SHOPPINGMALLMANAGER' },
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
    }
  ]
}
export const brandmanager = {
  path: '/brandmanager',
  component: Layout,
  redirect: '/brandmanager/brandlist',
  name: 'brandmanager',
  meta: { title: '品牌管理', icon: 'shopping', affix: false, menuno: 'SM_SHOPPINGBRANDMANAGER' },
  children: [
    {
      path: 'brandlist',
      name: '品牌列表',
      component: () => import('@/views/shopping/brandlist/index'),
      meta: { title: '品牌列表', icon: 'table', menuno: 'SM_SHOPPINGBRANDLIST' }
    },
    {
      path: 'brandtype',
      name: '品牌分类',
      component: () => import('@/views/shopping/brandsort/index'),
      meta: { title: '品牌分类', icon: 'table', menuno: 'SM_SHOPPINGBRANDSORT' }
    }
  ]
}
// 促销管理
export const promotionmanager = {
  path: '/promotion',
  component: Layout,
  redirect: '/promotion/couponlist',
  name: 'promotionmanager',
  meta: { title: '促销管理', icon: 'shopping', affix: false, menuno: 'SM_PROMOTIONMANAGER' },
  children: [
    {
      path: 'couponlist',
      name: '优惠券列表',
      component: () => import('@/views/promotion/couponlist/index'),
      meta: { title: '优惠券列表', icon: 'table', menuno: 'SM_SHOPCOUPONLIST' }
    }
  ]
}
// export default brandmanager
