import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import { setRouteComponenName } from '../index';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'System',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
  },
  children: [
    {
      path: 'tenant',
      name: 'Tenant',
      component: () => import('@/views/system/tenant/index.vue'),
      meta: {
        locale: 'menu.system.tenant',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.tenant'],
      },
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: 'menu.system.menu',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.menu'],
      },
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        locale: 'menu.system.user',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.user'],
      },
    },
    {
      path: 'user-info',
      name: 'UserInfo',
      component: () => import('@/views/system/user/info.vue'),
      meta: {
        locale: 'menu.system.user.info',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.user.info'],
      },
    },
    {
      path: 'user-add',
      name: 'UserAdd',
      component: () =>
        setRouteComponenName(import('@/views/system/user/save.vue'), 'UserAdd'),
      meta: {
        locale: 'menu.system.user.add',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.user.add'],
      },
    },
    {
      path: 'user-update',
      name: 'UserUpdate',
      component: () =>
        setRouteComponenName(
          import('@/views/system/user/save.vue'),
          'UserUpdate'
        ),
      meta: {
        locale: 'menu.system.user.update',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.user.update'],
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        locale: 'menu.system.role',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.role'],
      },
    },
    {
      path: 'role-add',
      name: 'RoleAdd',
      component: () =>
        setRouteComponenName(import('@/views/system/role/save.vue'), 'RoleAdd'),
      meta: {
        locale: 'menu.system.role.add',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.role.add'],
      },
    },
    {
      path: 'role-update',
      name: 'RoleUpdate',
      component: () =>
        setRouteComponenName(
          import('@/views/system/role/save.vue'),
          'RoleUpdate'
        ),
      meta: {
        locale: 'menu.system.role.update',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.role.update'],
      },
    },
    {
      path: 'notice',
      name: 'Notice',
      component: () => import('@/views/system/notice/index.vue'),
      meta: {
        locale: 'menu.system.notice',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.notice'],
      },
    },
    {
      path: 'notice-add',
      name: 'NoticeAdd',
      component: () =>
        setRouteComponenName(
          import('@/views/system/notice/save.vue'),
          'NoticeAdd'
        ),
      meta: {
        locale: 'menu.system.notice.add',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.notice.add'],
      },
    },
    {
      path: 'notice-update',
      name: 'NoticeUpdate',
      component: () =>
        setRouteComponenName(
          import('@/views/system/notice/save.vue'),
          'NoticeUpdate'
        ),
      meta: {
        locale: 'menu.system.notice.update',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.system', 'menu.system.notice.update'],
      },
    },
  ],
};

export default SYSTEM;
