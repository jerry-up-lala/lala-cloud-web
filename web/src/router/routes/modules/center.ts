import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CENTER: AppRouteRecordRaw = {
  path: '/center',
  name: 'center',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.center',
    icon: 'icon-user',
    requiresAuth: true,
  },
  children: [
    {
      path: 'user-personal',
      name: 'UserPersonal',
      component: () => import('@/views/center/userPersonal/index.vue'),
      meta: {
        locale: 'menu.center.userPersonal',
        requiresAuth: false,
        accessCodes: ['*'],
        breadcrumb: ['menu.center', 'menu.center.userPersonal'],
      },
    },
    {
      path: 'notice-user',
      name: 'NoticeUser',
      component: () => import('@/views/center/noticeUser/index.vue'),
      meta: {
        locale: 'menu.center.notice',
        requiresAuth: false,
        accessCodes: ['*'],
        breadcrumb: ['menu.center', 'menu.center.notice'],
      },
    },
    {
      path: 'notice-user-info',
      name: 'NoticeUserInfo',
      component: () => import('@/views/center/noticeUser/info.vue'),
      meta: {
        locale: 'menu.center.notice.info',
        requiresAuth: false,
        accessCodes: ['*'],
        breadcrumb: ['menu.center', 'menu.center.notice.info'],
      },
    },
  ],
};

export default CENTER;
