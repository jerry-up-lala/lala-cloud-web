import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import { USER_PERSONAL_URL } from '@/api/url/user-personal';

const personal = Mock.mock({
  'id|19': /[0-9]/,
  'loginName': '@name()',
  'realName': '@cname()',
  'mail': '@email',
  'nickName': '@cword(5)',
  'intro': '@cword(20)',
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(USER_PERSONAL_URL), 'get', () => {
      return successRWrap(personal);
    });
    Mock.mock(new RegExp(USER_PERSONAL_URL), 'put', () => {
      return successRWrap(null);
    });
  },
});
