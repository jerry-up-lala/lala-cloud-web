import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import { DEFAULT_ROUTE, LOGIN_ROUTE_NAME } from '@/router/constants';
import { appRouteTree } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: DEFAULT_ROUTE.fullPath,
    },
    {
      path: '/login',
      name: LOGIN_ROUTE_NAME,
      component: () => import('@/views/login/index.vue'),
    },
    ...appRouteTree,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
