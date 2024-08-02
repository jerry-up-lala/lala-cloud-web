import Mock from 'mockjs';
import setupMock, {
  MockParams,
  successRWrap,
  pageRWrap,
} from '@/mock/setup-mock';
import {
  USER_URL,
  USER_LIST_URL,
  USER_PAGE_URL,
  USER_INFO_URL,
  USER_PASSWORD_URL,
  USER_VERIFY_URL,
  USER_STATE_URL,
} from '@/api/url/user';
import { roleList } from '@/mock/role';
import { menuList } from '@/mock/menu';
import { user, userList } from '@/mock/common';

const userInfo = Mock.mock({
  ...user,
  'roleIds|1-5': roleList.list.map((item: { id: any }) => item.id),
  'menuButtonList': menuList.data,
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(
      new RegExp(import.meta.env.VITE_API_BASE_URL + USER_URL),
      'get',
      (params: MockParams) => {
        if (params.url.indexOf(USER_PAGE_URL) >= 0) {
          return pageRWrap(params, userList.list);
        }
        if (params.url.indexOf(USER_LIST_URL) >= 0) {
          return successRWrap(userList.list);
        }
        if (params.url.indexOf(USER_INFO_URL) >= 0) {
          return successRWrap(userInfo);
        }
        if (params.url.indexOf(USER_PASSWORD_URL) >= 0) {
          return successRWrap(Mock.mock('@string'));
        }
        if (params.url.indexOf(USER_VERIFY_URL) >= 0) {
          return successRWrap(null);
        }
        return successRWrap(userList.list);
      }
    );
    Mock.mock(new RegExp(USER_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(`${USER_URL}/`), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(USER_STATE_URL), 'post', () => {
      return successRWrap(null);
    });
  },
});
