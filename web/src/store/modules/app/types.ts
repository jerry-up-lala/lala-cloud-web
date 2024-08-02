import type { RouteRecordNormalized } from 'vue-router';

export interface AppUserSettingState {
  theme: string;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  menuCollapse: boolean;
  menuWidth: number;
  footer: boolean;
  tabBar: boolean;
  colorWeak: boolean;
}

export interface AppState extends AppUserSettingState {
  settingsRequest: boolean;
  mockModal: boolean;
  noticeUserUnreadCount: number[];
  hideMenu: boolean;
  globalSettings: boolean;
  device: string;
  routeTreeFromServer: boolean;
  routeTree: RouteRecordNormalized[];
  [key: string]: unknown;
}
