import { defineStore } from 'pinia';
import {
  loginApi,
  loginInfoApi,
  loginoutApi,
  LoginRequestBody,
} from '@/api/request/login';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { LoginState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): LoginState => ({
    userId: undefined,
    loginName: undefined,
    realName: undefined,
    tenantId: undefined,
    accessCodes: undefined,
  }),

  getters: {
    userInfo(state: LoginState): LoginState {
      return { ...state };
    },
  },

  actions: {
    async token(loginRequestBody: LoginRequestBody) {
      try {
        const { data } = await loginApi(loginRequestBody);
        setToken(data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    async loginInfo() {
      const res = await loginInfoApi();
      this.setLoginInfo(res.data);
    },

    // Set user's information
    setLoginInfo(partial: Partial<LoginState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    clearUserInfo() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearRouteTree();
    },
    // Logout
    async loginout(api: boolean) {
      try {
        if (api) {
          await loginoutApi();
        }
      } finally {
        this.clearUserInfo();
      }
    },
  },
});

export default useUserStore;
