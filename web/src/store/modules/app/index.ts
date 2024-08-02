import { defineStore } from 'pinia';
import { Notification, Modal } from '@arco-design/web-vue';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { routeTreeApi } from '@/api/request/menu';
import { noticeUserUnreadCountApi } from '@/api/request/notice-user';
import {
  userSettingInfoApi,
  userSettingSaveApi,
} from '@/api/request/user-setting';
import i18n from '@/locale/index';
import { isLogin } from '@/utils/auth';
import { AppState, AppUserSettingState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      settingsRequest: false,
      mockModal: false,
      ...defaultSettings,
    };
  },

  getters: {
    appRouteTree(state: AppState): RouteRecordNormalized[] {
      return state.routeTree as unknown as RouteRecordNormalized[];
    },
    getSettingsRequest(): boolean {
      return this.settingsRequest;
    },
    getMockModal(): boolean {
      return this.mockModal;
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState> | Partial<AppUserSettingState>) {
      const theme = partial?.theme === 'dark' ? 'dark' : 'light';
      localStorage.setItem('arco-theme', theme);
      partial.theme = theme;
      // @ts-ignore-next-line
      this.$patch(partial);
    },
    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
      this.userSettingSaveRequest();
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async setSettings() {
      if (isLogin()) {
        const { data } = await userSettingInfoApi();
        if (data) {
          this.updateSettings(data);
        }
        this.settingsRequest = true;
      }
    },
    mockRemind() {
      const { t } = i18n.global;
      if (import.meta.env.VITE_MOCK_OPEN === 'true') {
        Modal.warning({
          title: t('common.tip'),
          titleAlign: 'start',
          width: 320,
          draggable: true,
          footer: true,
          simple: false,
          content: t('common.mock'),
        });
      }
      this.mockModal = true;
    },
    async userSettingSaveRequest() {
      await userSettingSaveApi({
        theme: this.theme,
        navbar: this.navbar,
        menu: this.menu,
        topMenu: this.topMenu,
        menuCollapse: this.menuCollapse,
        menuWidth: this.menuWidth,
        footer: this.footer,
        tabBar: this.tabBar,
        colorWeak: this.colorWeak,
      });
    },
    async routeTreeRequest() {
      const { t } = i18n.global;
      try {
        Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: t('common.route.loading'),
          closable: true,
        });
        const { data } = await routeTreeApi();
        this.routeTree = data;
        Notification.success({
          id: 'menuNotice',
          content: t('common.route.success'),
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Notification.error({
          id: 'menuNotice',
          content: t('common.route.error'),
          closable: true,
        });
      }
    },
    async noticeUserUnreadCountRequest() {
      try {
        const { data } = await noticeUserUnreadCountApi();
        this.noticeUserUnreadCount = [data[0], data[1], data[2]];
      } catch (err) {
        // err
      } finally {
        // finally
      }
    },
    clearRouteTree() {
      this.routeTree = [];
    },
  },
});

export default useAppStore;
