import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import { loadMetaInfo } from '@/router/meta';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const metaInfo = loadMetaInfo(route);
      return (
        !metaInfo?.requiresAuth ||
        !metaInfo?.accessCodes ||
        metaInfo?.accessCodes?.includes('*') ||
        metaInfo?.accessCodes?.find((r: any) => {
          return userStore.accessCodes && userStore.accessCodes.includes(r);
        })
      );
    },
    findFirstPermissionRoute(_routers: any, accessCodes?: string[]) {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          loadMetaInfo(firstElement)?.accessCodes?.find((el: string[]) => {
            return (
              el.includes('*') ||
              (accessCodes &&
                el?.find((e) => {
                  return accessCodes.includes(e);
                }))
            );
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
