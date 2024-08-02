import { useTabBarStore } from '@/store';
import { useRoute, useRouter as _useRouter } from 'vue-router';

export default function useRouter() {
  const tabBarStore = useTabBarStore();
  const route = useRoute();
  const router = _useRouter();
  const tabClose = (pushName: string) => {
    tabBarStore.cancelTag(route.name as string);
    router.push({
      name: pushName,
    });
  };
  return {
    route,
    router,
    tabClose,
  };
}
