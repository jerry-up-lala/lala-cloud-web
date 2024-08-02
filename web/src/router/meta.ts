import { useAppStore } from '@/store';
import appClientMenus from '@/router/app-menus';
import { treeArrayFind } from '@/utils/array';

export const loadMetaInfo = (route: any) => {
  const appStore = useAppStore();
  const routeInfo = treeArrayFind(
    appStore.routeTreeFromServer ? appStore.appRouteTree : appClientMenus,
    route.name,
    'name'
  );
  if (routeInfo && routeInfo.meta) {
    return routeInfo.meta;
  }
  return route.meta;
};

export default {};
