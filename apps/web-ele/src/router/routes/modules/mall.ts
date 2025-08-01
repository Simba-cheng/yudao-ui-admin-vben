import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/mall/product',
    name: 'ProductCenter',
    meta: {
      title: '商品中心',
      icon: 'lucide:shopping-bag',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: 'spu/add',
        name: 'ProductSpuAdd',
        meta: {
          title: '商品添加',
          activeMenu: '/mall/product/spu',
        },
        component: () => import('#/views/mall/product/spu/modules/form.vue'),
      },
      {
        path: String.raw`spu/edit/:id(\d+)`,
        name: 'ProductSpuEdit',
        meta: {
          title: '商品编辑',
          activeMenu: '/mall/product/spu',
        },
        component: () => import('#/views/mall/product/spu/modules/form.vue'),
      },
      {
        path: String.raw`spu/detail/:id(\d+)`,
        name: 'ProductSpuDetail',
        meta: {
          title: '商品详情',
          activeMenu: '/crm/business',
        },
        component: () => import('#/views/mall/product/spu/modules/detail.vue'),
      },
    ],
  },
  {
    path: '/mall/trade',
    name: 'TradeCenter',
    meta: {
      title: '交易中心',
      icon: 'lucide:shopping-cart',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: String.raw`order/detail/:id(\d+)`,
        name: 'TradeOrderDetail',
        meta: {
          title: '订单详情',
          activeMenu: '/mall/trade/order',
        },
        component: () => import('#/views/mall/trade/order/modules/detail.vue'),
      },
      {
        path: String.raw`after-sale/detail/:id(\d+)`,
        name: 'TradeAfterSaleDetail',
        meta: {
          title: '退款详情',
          activeMenu: '/mall/trade/after-sale',
        },
        component: () =>
          import('#/views/mall/trade/afterSale/modules/detail.vue'),
      },
    ],
  },
];

export default routes;
