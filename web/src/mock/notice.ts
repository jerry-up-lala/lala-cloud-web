import Mock from 'mockjs';
import { arrayRandom } from '@/utils/array';
import setupMock, {
  MockParams,
  successRWrap,
  pageRWrap,
} from '@/mock/setup-mock';
import {
  NOTICE_URL,
  NOTICE_PAGE_URL,
  NOTICE_INFO_URL,
  NOTICE_USER_PAGE_URL,
} from '@/api/url/notice';
import { userList } from '@/mock/common';

const notice = {
  id: '@increment',
  title: '@ctitle(5, 8)',
  noticeType: '@integer(1, 2)',
  sendState: '@integer(0, 1)',
  sendTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
};

const userIdArray = userList.list.map((item: { id: any }) => item.id);

const noticeList = Mock.mock({
  'list|10-100': [notice],
});

const noticeUserList = Mock.mock({
  'list|10-100': [
    {
      'id': '@increment',
      'userId|1': userIdArray,
      'readState': '@integer(0, 2)',
      'readTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'loginName': '@name()',
      'realName': '@cname()',
    },
  ],
});

const noticeInfo = Mock.mock({
  ...notice,
  html: '@cparagraph',
  userIds: arrayRandom(userIdArray, 2, 5),
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(NOTICE_PAGE_URL), 'get', (params: MockParams) => {
      return pageRWrap(params, noticeList.list);
    });
    Mock.mock(new RegExp(NOTICE_USER_PAGE_URL), 'get', (params: MockParams) => {
      return pageRWrap(params, noticeUserList.list);
    });
    Mock.mock(new RegExp(NOTICE_INFO_URL), 'get', () => {
      return successRWrap(noticeInfo);
    });
    Mock.mock(new RegExp(NOTICE_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(NOTICE_URL), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(NOTICE_URL), 'delete', () => {
      return successRWrap(null);
    });
  },
});
