import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { LOGIN_ROUTE_NAME } from '@/router/constants';

export default function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const loginout = async (api = true, logoutTo = LOGIN_ROUTE_NAME) => {
    await userStore.loginout(api);
    window.location.reload();
    const currentRoute = router.currentRoute.value;
    router.push({
      name: logoutTo,
      query: {
        ...router.currentRoute.value.query,
        redirect: currentRoute.name as string,
      },
    });
  };
  return {
    loginout,
  };
}
