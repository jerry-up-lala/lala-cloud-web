import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import CONCURRENT_URL from '@/api/url/concurrent';

const concurrent = Mock.mock({
  'key|19': /[0-9]/,
  'infos|1-20': [
    {
      threadName: '@word(5, 8)',
      runDateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(CONCURRENT_URL), 'get', () => {
      return successRWrap(concurrent);
    });
    Mock.mock(new RegExp(CONCURRENT_URL), 'post', () => {
      return successRWrap(null);
    });
  },
});
