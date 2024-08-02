import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import MQ_URL from '@/api/url/mq';

const mq = Mock.mock({
  'key|19': /[0-9]/,
  'infos|1-20': [
    {
      consumerThreadName: '@ctitle(5, 8)',
      info: '@csentence(20, 40)',
      producerDateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      consumerDateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(MQ_URL), 'get', () => {
      return successRWrap(mq);
    });
    Mock.mock(new RegExp(MQ_URL), 'post', () => {
      return successRWrap(null);
    });
  },
});
