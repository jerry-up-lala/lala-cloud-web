import Mock from 'mockjs';
import setupMock, {
  MockParams,
  successRWrap,
  pageRWrap,
} from '@/mock/setup-mock';
import {
  TENANT_URL,
  TENANT_PAGE_URL,
  TENANT_LIST_URL,
  TENANT_INFO_URL,
  TENANT_PASSWORD_URL,
  TENANT_VERIFY_URL,
} from '@/api/url/tenant';

const tenant = {
  'id|19': /[0-9]/,
  'tenantName': '@ctitle(5, 8)',
  'state': '@boolean',
  'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
  'createUser': '@cname()',
  'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
  'updateUser': '@cname()',
  'userId|19': /[0-9]/,
  'loginName': '@name()',
  'realName': '@cname()',
  'userState': '@boolean',
};

const tenantList = Mock.mock({
  'list|15-55': [tenant],
});

const info = Mock.mock(tenant);

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(TENANT_PAGE_URL), 'get', (params: MockParams) => {
      return pageRWrap(params, tenantList.list);
    });
    Mock.mock(new RegExp(TENANT_LIST_URL), 'get', () => {
      return successRWrap(tenantList.list);
    });
    Mock.mock(new RegExp(TENANT_INFO_URL), 'get', () => {
      return successRWrap(info);
    });
    Mock.mock(new RegExp(TENANT_PASSWORD_URL), 'get', () => {
      return successRWrap(Mock.mock('@string'));
    });
    Mock.mock(new RegExp(TENANT_VERIFY_URL), 'get', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(TENANT_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(`${TENANT_URL}/`), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(`${TENANT_URL}`), 'delete', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(`${TENANT_URL}/`), 'delete', () => {
      return successRWrap(null);
    });
  },
});
