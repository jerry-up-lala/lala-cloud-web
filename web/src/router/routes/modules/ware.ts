import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WARE: AppRouteRecordRaw = {
  path: '/ware',
  name: 'Ware',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.ware',
    requiresAuth: true,
    icon: 'icon-relation',
  },
  children: [
    {
      path: 'redis',
      name: 'Redis',
      component: () => import('@/views/ware/redis/index.vue'),
      meta: {
        locale: 'menu.ware.redis',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.ware', 'menu.ware.redis'],
      },
    },
    {
      path: 'mq',
      name: 'Mq',
      component: () => import('@/views/ware/mq/index.vue'),
      meta: {
        locale: 'menu.ware.mq',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.ware', 'menu.ware.mq'],
      },
    },
  ],
};

export default WARE;
