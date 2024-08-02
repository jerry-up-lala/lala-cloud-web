import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import { USER_SETTING_URL } from '@/api/url/user-setting';

const setting = Mock.mock({
  theme: 'light',
  navbar: true,
  menu: true,
  topMenu: false,
  menuCollapse: false,
  menuWidth: 220,
  footer: true,
  tabBar: true,
  colorWeak: false,
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(USER_SETTING_URL), 'get', () => {
      return successRWrap(setting);
    });
    Mock.mock(new RegExp(USER_SETTING_URL), 'post', () => {
      return successRWrap(null);
    });
  },
});
