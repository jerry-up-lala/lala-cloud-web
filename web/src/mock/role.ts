import Mock from 'mockjs';
import setupMock, {
  MockParams,
  successRWrap,
  pageRWrap,
} from '@/mock/setup-mock';
import {
  ROLE_URL,
  ROLE_PAGE_URL,
  ROLE_LIST_URL,
  ROLE_INFO_URL,
  ROLE_VERIFY_URL,
} from '@/api/url/role';

import { menuList } from '@/mock/menu';
import { userList } from '@/mock/common';

const role = {
  id: '@increment',
  roleName: '@cword(3, 8)',
  description: '@csentence()',
  state: '@boolean',
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
};

export const roleList = Mock.mock({
  'list|15-55': [role],
});

const roleInfo = Mock.mock({
  ...role,
  'menuIds|5-55': menuList.data.map((item: { id: any }) => item.id),
  'userIds|1-10': userList.list.map((item: { id: any }) => item.id),
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(ROLE_PAGE_URL), 'get', (params: MockParams) => {
      return pageRWrap(params, roleList.list);
    });
    Mock.mock(new RegExp(ROLE_LIST_URL), 'get', () => {
      return successRWrap(roleList.list);
    });
    Mock.mock(new RegExp(ROLE_INFO_URL), 'get', () => {
      return successRWrap(roleInfo);
    });
    Mock.mock(new RegExp(ROLE_VERIFY_URL), 'get', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(ROLE_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(`${ROLE_URL}/`), 'put', () => {
      return successRWrap(null);
    });
  },
});

export default {};
