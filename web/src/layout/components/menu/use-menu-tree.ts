import { computed } from 'vue';
import { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import usePermission from '@/hooks/permission';
import { useAppStore } from '@/store';
import appClientMenus from '@/router/app-menus';
import { loadMetaInfo } from '@/router/meta';
import { cloneDeep } from 'lodash';

const sortRouter = (router: any[]) => {
  router.forEach((item: any) => {
    if (item.children) {
      router.sort((a: any, b: any) => {
        return (loadMetaInfo(a).order || 0) - (loadMetaInfo(b).order || 0);
      });
    }
  });
};

export default function useMenuTree() {
  const permission = usePermission();
  const appStore = useAppStore();
  const appRoute = computed(() => {
    if (appStore.routeTreeFromServer) {
      return appStore.appRouteTree;
    }
    return appClientMenus;
  });
  const menuTree = computed(() => {
    const copyRouter = cloneDeep(appRoute.value) as RouteRecordNormalized[];
    copyRouter.sort((a: any, b: any) => {
      return (loadMetaInfo(a).order || 0) - (loadMetaInfo(b).order || 0);
    });
    sortRouter(copyRouter);
    function travel(_routes: RouteRecordRaw[], layer: number) {
      if (!_routes) return null;

      const collector: any = _routes.map((element) => {
        // no access
        if (!permission.accessRouter(element)) {
          return null;
        }

        // leaf node
        if (loadMetaInfo(element)?.hideChildrenInMenu || !element.children) {
          element.children = [];
          return element;
        }

        // route filter hideInMenu true
        element.children = element.children.filter(
          (x) => loadMetaInfo(x)?.hideInMenu !== true
        );

        // Associated child node
        const subItem = travel(element.children, layer + 1);

        if (subItem.length) {
          element.children = subItem;
          return element;
        }
        // the else logic
        if (layer > 1) {
          element.children = subItem;
          return element;
        }

        if (loadMetaInfo(element)?.hideInMenu === false) {
          return element;
        }

        return null;
      });
      return collector.filter(Boolean);
    }
    return travel(copyRouter, 0);
  });

  return {
    menuTree,
  };
}
