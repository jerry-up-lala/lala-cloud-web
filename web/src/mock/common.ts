import Mock from 'mockjs';
import setupMock from '@/mock/setup-mock';
import { COMMON_SNOW_ID_URL } from '@/api/url/common';

const snowId = Mock.mock({
  'data|19': /[0-9]/,
});

export const user = {
  'id|19': /[0-9]/,
  'loginName': '@name()',
  'realName': '@cname()',
  'mail': '@email',
  'nickName': '@cword(5)',
  'intro': '@cword(20)',
  'state': '@boolean',
  'tenantAdmin': '@boolean',
  'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
  'effectiveRoleNames|1-3': '@cword(1-5)',
  'invalidRoleNames|1-3': '@cword(1-5)',
};

export const userList = Mock.mock({
  'list|10-100': [user],
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(COMMON_SNOW_ID_URL), 'get', () => {
      return snowId;
    });
  },
});
