import Mock from 'mockjs';
import setupMock, {
  MockParams,
  successRWrap,
  pageRWrap,
} from '@/mock/setup-mock';
import { CRUD_URL, CRUD_PAGE_URL, CRUD_INFO_URL } from '@/api/url/crud';

const crud = {
  'id|19': /[0-9]/,
  'input': '@ctitle(5, 8)',
  'inputNumber': '@float(60, 100, 0, 2)',
  'inputTagList|1-3': ['@ctitle(2)'],
  'autoComplete': '@ctitle(5, 8)',
  'mention': '@cname',
  'textArea': '@csentence',
  'rate': '@integer(1, 5, 0, 1)',
  'slider': '@integer(0, 100)',
  'switchInfo': '@pick(["true", "false"])',
  'radio': '@pick(["1", "2", "3"])',
  'checkboxList|1-2': ['@pick(["1", "2", "3"])'],
  'selectInfo': '@pick(["1", "2", "3"])',
  'cascader':
    '@pick(["1", "2", "3", "1-4", "1-5", "1-6", "2-7", "2-8", "2-9", "3-10", "3-11", "3-12"])',
  'treeSelect':
    '@pick(["1", "2", "3", "1-4", "1-5", "1-6", "2-7", "2-8", "2-9", "3-10", "3-11", "3-12"])',
  'transferList|1-2': ['@pick(["1", "2", "3"])'],
  'dateTimePicker': '@datetime("yyyy-MM-dd HH:mm:ss")',
  'upload': '@url',
};

const crudList = Mock.mock({
  'list|15-100': [crud],
});

const info = Mock.mock(crud);

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(CRUD_PAGE_URL), 'get', (params: MockParams) => {
      return pageRWrap(params, crudList.list);
    });
    Mock.mock(new RegExp(CRUD_INFO_URL), 'get', () => {
      return successRWrap(info);
    });
    Mock.mock(new RegExp(CRUD_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(CRUD_URL), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(CRUD_URL), 'delete', () => {
      return successRWrap(null);
    });
  },
});
