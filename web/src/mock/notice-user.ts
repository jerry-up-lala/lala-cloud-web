import Mock from 'mockjs';
import setupMock, {
  MockParams,
  successRWrap,
  pageRWrap,
} from '@/mock/setup-mock';
import {
  NOTICE_USER_URL,
  NOTICE_USER_PAGE_URL,
  NOTICE_USER_UNREAD_COUNT_URL,
  NOTICE_USER_INFO_URL,
} from '@/api/url/notice-user';

const noticeUser = {
  id: '@increment',
  title: '@ctitle(5, 8)',
  noticeType: '@integer(1, 2)',
  readState: '@integer(0, 2)',
  sendTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
  readTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
};

const noticeUserList = Mock.mock({
  'list|10-100': [noticeUser],
});

const noticeUserInfo = Mock.mock({
  ...noticeUser,
  html: '@cparagraph',
});

const noticeGroupCount = {
  data: {
    '0': 7,
    '1': 3,
    '2': 4,
  },
  error: null,
};

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(NOTICE_USER_PAGE_URL), 'get', (params: MockParams) => {
      return pageRWrap(params, noticeUserList.list);
    });
    Mock.mock(new RegExp(NOTICE_USER_UNREAD_COUNT_URL), 'get', () => {
      return noticeGroupCount;
    });
    Mock.mock(new RegExp(NOTICE_USER_INFO_URL), 'get', () => {
      return successRWrap(noticeUserInfo);
    });
    Mock.mock(new RegExp(NOTICE_USER_URL), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(NOTICE_USER_URL), 'delete', () => {
      return successRWrap(null);
    });
  },
});
