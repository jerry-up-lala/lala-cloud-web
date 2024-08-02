import type {
  Router,
  RouteRecordNormalized,
  LocationQueryRaw,
} from 'vue-router';
import usePermission from '@/hooks/permission';
import { useAppStore, useUserStore, useDictStore } from '@/store';
import {
  LOGIN_ROUTE_NAME,
  WHITE_LIST,
  NOT_FOUND_ROUTE_NAME,
} from '@/router/constants';
import { isLogin } from '@/utils/auth';
import { setRouteEmitter } from '@/utils/route-listener';
import appClientMenus from '@/router/app-menus';
import NProgress from 'nprogress';

function setupSettingsGuard(router: Router) {
  router.beforeEach(async () => {
    const appStore = useAppStore();
    if (!appStore.getSettingsRequest) {
      await appStore.setSettings();
    }
  });
}

function setupMockGuard(router: Router) {
  router.beforeEach(async () => {
    const appStore = useAppStore();
    if (!appStore.getMockModal) {
      await appStore.mockRemind();
    }
  });
}

function setupDictGuard(router: Router) {
  router.beforeEach(async () => {
    const userStore = useUserStore();
    const dictStore = useDictStore();
    if (userStore.userInfo?.userId && !dictStore.getDictRequest) {
      await dictStore.setDict();
    }
  });
}

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    if (isLogin()) {
      if (userStore.accessCodes) {
        next();
      } else {
        try {
          await userStore.loginInfo();
          next();
        } catch (error) {
          next({
            name: LOGIN_ROUTE_NAME,
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (to.name === LOGIN_ROUTE_NAME) {
        next();
        return;
      }
      next({
        name: LOGIN_ROUTE_NAME,
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}

function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (appStore.routeTreeFromServer) {
      if (
        !appStore.appRouteTree.length &&
        !WHITE_LIST.find((el) => el.name === to.name)
      ) {
        await appStore.routeTreeRequest();
      }
      const routeTree = [...appStore.appRouteTree, ...WHITE_LIST];

      let exist = false;
      while (routeTree.length && !exist) {
        const element = routeTree.shift();
        if (element?.name === to.name) exist = true;

        if (element?.children) {
          routeTree.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }
      if (exist && permissionsAllow) {
        next();
      } else {
        next(NOT_FOUND_ROUTE_NAME);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (permissionsAllow) next();
      else {
        const destination =
          Permission.findFirstPermissionRoute(
            appClientMenus,
            userStore.accessCodes
          ) || NOT_FOUND_ROUTE_NAME;
        next(destination);
      }
    }
  });
}

export default function createRouteGuard(router: Router) {
  NProgress.start();
  setupMockGuard(router);
  setupSettingsGuard(router);
  setupDictGuard(router);
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
  NProgress.done();
}
