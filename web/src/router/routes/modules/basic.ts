import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BASIC: AppRouteRecordRaw = {
  path: '/basic',
  name: 'basic',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.basic',
    requiresAuth: true,
    icon: 'icon-save',
  },
  children: [
    {
      path: 'http',
      name: 'Http',
      component: () => import('@/views/basic/http/index.vue'),
      meta: {
        locale: 'menu.basic.http',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.basic', 'menu.basic.http'],
      },
    },
    {
      path: 'concurrent',
      name: 'Concurrent',
      component: () => import('@/views/basic/concurrent/index.vue'),
      meta: {
        locale: 'menu.basic.concurrent',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.basic', 'menu.basic.concurrent'],
      },
    },
  ],
};

export default BASIC;
