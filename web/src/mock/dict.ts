import Mock from 'mockjs';
import setupMock, { successRWrap } from '@/mock/setup-mock';
import {
  DICT_URL,
  DICT_ITEM_URL,
  DICT_LIST_URL,
  DICT_INFO_URL,
  DICT_REFRESH_CACHE_URL,
  DICT_VERIFY_NAME_URL,
  DICT_VERIFY_KEY_URL,
  DICT_ITEM_TREE_URL,
  DICT_ITEM_CASCADER_URL,
  DICT_ITEM_INFO_URL,
  DICT_ITEM_VERIFY_LABEL_URL,
  DICT_ITEM_VERIFY_VALUE_URL,
  DICT_ITEM_ALL_URL,
} from '@/api/url/dict';

const dictData = {
  'id|19': /[0-9]/,
  'dictName': '@cword(5, 10)',
  'dictKey': '@string(5, 8)',
};

const dictItemCascaderData = {
  'value|19': /[0-9]/,
  'label': '@cword(5)',
};

const dictItemInfoData = {
  'id|19': /[0-9]/,
  'dictId|19': /[0-9]/,
  'parentId|19': /[0-9]/,
  'label': '@cword(5)',
  'value': '@string(5)',
  'sortOrder': '@integer(1, 20)',
  'dictName': '@cword(5)',
  'dictKey': '@string(5)',
};

const dictList = Mock.mock({
  'list|10-20': [dictData],
});

const dictInfo = Mock.mock({
  'id|19': /[0-9]/,
  'dictName': '@cword(5, 10)',
  'dictKey': '@string(5, 8)',
});

const dictItemTree = Mock.mock({
  'list|3-5': [
    {
      ...dictItemInfoData,
      'children|1-3': [dictItemInfoData],
    },
  ],
});

const dictItemCascader = Mock.mock({
  'list|3-5': [
    {
      ...dictItemCascaderData,
      'children|1-3': [dictItemCascaderData],
    },
  ],
});

const dictItemInfo = Mock.mock(dictItemInfoData);

const dictItemAll = {
  STATE: [
    {
      label: '启用',
      value: 'true',
      labels: '启用',
      values: 'true',
      children: null,
    },
    {
      label: '停用',
      value: 'false',
      labels: '停用',
      values: 'false',
      children: null,
    },
  ],
  CRUD_TREE: [
    {
      label: '编码',
      value: '1',
      labels: '编码',
      values: '1',
      children: [
        {
          label: 'Java',
          value: '4',
          labels: '编码-Java',
          values: '1-4',
          children: null,
        },
        {
          label: 'Go',
          value: '5',
          labels: '编码-Go',
          values: '1-5',
          children: null,
        },
        {
          label: 'Node.js',
          value: '6',
          labels: '编码-Node.js',
          values: '1-6',
          children: null,
        },
      ],
    },
    {
      label: '足球',
      value: '2',
      labels: '足球',
      values: '2',
      children: [
        {
          label: '皇马',
          value: '7',
          labels: '足球-皇马',
          values: '2-7',
          children: null,
        },
        {
          label: '曼联',
          value: '8',
          labels: '足球-曼联',
          values: '2-8',
          children: null,
        },
        {
          label: '里斯本竞技',
          value: '9',
          labels: '足球-里斯本竞技',
          values: '2-9',
          children: null,
        },
      ],
    },
    {
      label: 'F1',
      value: '3',
      labels: 'F1',
      values: '3',
      children: [
        {
          label: '阿斯顿马丁',
          value: '10',
          labels: 'F1-阿斯顿马丁',
          values: '3-10',
          children: null,
        },
        {
          label: '红牛',
          value: '11',
          labels: 'F1-红牛',
          values: '3-11',
          children: null,
        },
        {
          label: '梅赛德斯AMG',
          value: '12',
          labels: 'F1-梅赛德斯AMG',
          values: '3-12',
          children: null,
        },
      ],
    },
  ],
  CRUD_LIST: [
    {
      label: '编码',
      value: '1',
      labels: '编码',
      values: '1',
      children: null,
    },
    {
      label: '足球',
      value: '2',
      labels: '足球',
      values: '2',
      children: null,
    },
    {
      label: 'F1',
      value: '3',
      labels: 'F1',
      values: '3',
      children: null,
    },
  ],
};

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(DICT_LIST_URL), 'get', () => {
      return successRWrap(dictList.list);
    });
    Mock.mock(new RegExp(DICT_INFO_URL), 'get', () => {
      return successRWrap(dictInfo);
    });
    Mock.mock(new RegExp(DICT_VERIFY_NAME_URL), 'get', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_VERIFY_KEY_URL), 'get', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_URL), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_URL), 'delete', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_REFRESH_CACHE_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_ITEM_TREE_URL), 'get', () => {
      return successRWrap(dictItemTree.list);
    });
    Mock.mock(new RegExp(DICT_ITEM_CASCADER_URL), 'get', () => {
      return successRWrap(dictItemCascader.list);
    });
    Mock.mock(new RegExp(DICT_ITEM_INFO_URL), 'get', () => {
      return successRWrap(dictItemInfo);
    });
    Mock.mock(new RegExp(DICT_ITEM_VERIFY_LABEL_URL), 'get', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_ITEM_VERIFY_VALUE_URL), 'get', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_ITEM_URL), 'post', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_ITEM_URL), 'put', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_ITEM_URL), 'delete', () => {
      return successRWrap(null);
    });
    Mock.mock(new RegExp(DICT_ITEM_ALL_URL), 'get', () => {
      return successRWrap(dictItemAll);
    });
  },
});
