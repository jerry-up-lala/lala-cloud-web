import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DEV: AppRouteRecordRaw = {
  path: '/dev',
  name: 'Dev',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dev',
    requiresAuth: true,
    icon: 'icon-code',
  },
  children: [
    {
      path: 'log-request',
      name: 'LogRequest',
      component: () => import('@/views/dev/log-request/index.vue'),
      meta: {
        locale: 'menu.dev',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.dev', 'menu.dev.log.request'],
      },
    },
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('@/views/dev/dict/index.vue'),
      meta: {
        locale: 'menu.dev',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.dev', 'menu.dev.dict'],
      },
    },
    {
      path: 'gen',
      name: 'Gen',
      component: () => import('@/views/dev/gen/index.vue'),
      meta: {
        locale: 'menu.dev.gen',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.dev', 'menu.dev.gen'],
      },
    },
    {
      path: 'gen-operate',
      name: 'GenOperate',
      component: () => import('@/views/dev/gen/operate.vue'),
      meta: {
        locale: 'menu.dev.gen.operate',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.basic', 'menu.dev.gen.operate'],
      },
    },
    {
      path: 'empty',
      name: 'Empty',
      component: () => import('@/views/dev/empty/index.vue'),
      meta: {
        locale: 'menu.dev.empty',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.dev', 'menu.dev.empty'],
      },
    },
  ],
};

export default DEV;
