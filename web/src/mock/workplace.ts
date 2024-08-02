import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import {
  WORK_PLACE_STATISTIC_URL,
  WORK_PLACE_LOG_SUM_URL,
  WORK_PLACE_LOG_SERVLET_METHOD_URL,
  WORK_PLACE_LOG_API_NAME_URL,
  WORK_PLACE_NOTICE_URL,
} from '@/api/url/workplace';

const statistic = Mock.mock({
  menu: 72,
  apiCount: '@integer(150, 200)',
  apiDoc: 'https://jerry-up-lala-cloud.apifox.cn',
  request: '@integer(200, 10000)',
  requestQoq: '@integer(-100, 0)',
});

const logSum = Mock.mock({
  column: [
    {
      x: '2024-01-09',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-10',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-11',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-15',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-18',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-19',
      y: '@integer(0, 10000)',
    },
  ],
  data: [
    {
      x: '2024-01-09',
      name: '1',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-09',
      name: '2',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-10',
      name: '1',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-10',
      name: '2',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-11',
      name: '1',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-11',
      name: '2',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-15',
      name: '1',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-15',
      name: '2',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-18',
      name: '1',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-18',
      name: '2',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-19',
      name: '1',
      y: '@integer(0, 10000)',
    },
    {
      x: '2024-01-19',
      name: '2',
      y: '@integer(0, 10000)',
    },
  ],
});

const logServletMethod = Mock.mock([
  {
    type: 'DELETE',
    value: '@integer(0, 500)',
  },
  {
    type: 'GET',
    value: '@integer(0, 500)',
  },
  {
    type: 'POST',
    value: '@integer(0, 500)',
  },
  {
    type: 'PUT',
    value: '@integer(0, 500)',
  },
]);

const logApiName = Mock.mock({
  'data|5': [
    {
      apiName: '@cword(5,8)',
      count: '@integer(1, 500)',
      maxRequestTime: '@datetime',
    },
  ],
});

const notice = Mock.mock({
  'data|5': [
    {
      id: '@increment',
      title: '@ctitle(5, 8)',
      noticeType: '@integer(1, 2)',
      readState: '@integer(0, 2)',
      sendTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      readTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(WORK_PLACE_STATISTIC_URL), 'get', () => {
      return successRWrap(statistic);
    });
    Mock.mock(new RegExp(WORK_PLACE_LOG_SUM_URL), 'get', () => {
      return successRWrap(logSum);
    });
    Mock.mock(new RegExp(WORK_PLACE_LOG_SERVLET_METHOD_URL), 'get', () => {
      return successRWrap(logServletMethod);
    });
    Mock.mock(new RegExp(WORK_PLACE_LOG_API_NAME_URL), 'get', () => {
      return logApiName;
    });
    Mock.mock(new RegExp(WORK_PLACE_NOTICE_URL), 'get', () => {
      return notice;
    });
  },
});
