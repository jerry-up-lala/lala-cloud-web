import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import { setRouteComponenName } from '../index';

const CRUD: AppRouteRecordRaw = {
  path: '/crud',
  name: 'crud',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.crud',
    requiresAuth: true,
    icon: 'icon-select-all',
  },
  children: [
    {
      path: 'crud-arco',
      name: 'CrudArco',
      component: () => import('@/views/crud/arco/index.vue'),
      meta: {
        locale: 'menu.crud.arco',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.arco'],
      },
    },
    {
      path: 'crud-arco-add',
      name: 'CrudArcoAdd',
      component: () =>
        setRouteComponenName(
          import('@/views/crud/arco/save.vue'),
          'CrudArcoAdd'
        ),
      meta: {
        locale: 'menu.crud.arco.add',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.arco.add'],
      },
    },
    {
      path: 'crud-arco-update',
      name: 'CrudArcoUpdate',
      component: () =>
        setRouteComponenName(
          import('@/views/crud/arco/save.vue'),
          'CrudArcoUpdate'
        ),
      meta: {
        locale: 'menu.crud.arco.update',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.arco.update'],
      },
    },
    {
      path: 'crud-arco-upload',
      name: 'CrudArcoUpload',
      component: () => import('@/views/crud/arco/upload.vue'),
      meta: {
        locale: 'menu.crud.arco.upload',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.arco.upload'],
      },
    },
    {
      path: 'crud-components',
      name: 'CrudComponents',
      component: () => import('@/views/crud/components/index.vue'),
      meta: {
        locale: 'menu.crud.components',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.components'],
      },
    },
    {
      path: 'crud-components-add',
      name: 'CrudComponentsAdd',
      component: () =>
        setRouteComponenName(
          import('@/views/crud/components/save.vue'),
          'CrudCOMPonentsAdd'
        ),
      meta: {
        locale: 'menu.crud.components.add',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.components.add'],
      },
    },
    {
      path: 'crud-components-update',
      name: 'CrudComponentsUpdate',
      component: () =>
        setRouteComponenName(
          import('@/views/crud/components/save.vue'),
          'CrudComponentsUpdate'
        ),
      meta: {
        locale: 'menu.crud.components.update',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.components.update'],
      },
    },
    {
      path: 'crud-components-upload',
      name: 'CrudComponentsUpload',
      component: () => import('@/views/crud/components/upload.vue'),
      meta: {
        locale: 'menu.crud.components.upload',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.components.upload'],
      },
    },
    {
      path: 'crud-gen',
      name: 'CrudGen',
      component: () => import('@/views/crud/gen/index.vue'),
      meta: {
        locale: 'menu.crud.gen',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.gen'],
      },
    },
    {
      path: 'crud-gen-add',
      name: 'CrudGenAdd',
      component: () =>
        setRouteComponenName(
          import('@/views/crud/gen/save.vue'),
          'CrudCOMPonentsAdd'
        ),
      meta: {
        locale: 'menu.crud.gen.add',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.gen.add'],
      },
    },
    {
      path: 'crud-gen-update',
      name: 'CrudGenUpdate',
      component: () =>
        setRouteComponenName(
          import('@/views/crud/gen/save.vue'),
          'CrudGenUpdate'
        ),
      meta: {
        locale: 'menu.crud.gen.update',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.gen.update'],
      },
    },
    {
      path: 'crud-gen-upload',
      name: 'CrudGenUpload',
      component: () => import('@/views/crud/gen/upload.vue'),
      meta: {
        locale: 'menu.crud.gen.upload',
        requiresAuth: true,
        hideInMenu: true,
        noAffix: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.crud', 'menu.crud.gen.upload'],
      },
    },
  ],
};

export default CRUD;
