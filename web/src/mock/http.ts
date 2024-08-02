import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import HTTP_URL from '@/api/url/http';

const http = Mock.mock({
  'key|19': /[0-9]/,
  'infos|1-20': [
    {
      threadName: '@ctitle(5, 8)',
      sendResult: '@csentence(20, 40)',
      sendDateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(HTTP_URL), 'get', () => {
      return successRWrap(http);
    });
    Mock.mock(new RegExp(HTTP_URL), 'post', () => {
      return successRWrap(null);
    });
  },
});
