import Mock from 'mockjs';
import setupMock, { MockParams, successRWrap } from '@/mock/setup-mock';
import {
  REDIS_URL,
  REDIS_KEYS_TREE_URL,
  REDIS_KEYS_LIST_URL,
  REDIS_KEY_INFO_URL,
  REDIS_HAS_KEY_URL,
  REDIS_KEY_EXPIRE_URL,
  REDIS_KEY_STRING_URL,
  REDIS_KEY_LIST_ELEMENT_URL,
  REDIS_KEY_SET_MEMBERS_URL,
  REDIS_KEY_ZSET_MEMBERS_URL,
  REDIS_KEY_ZSET_MEMBER_SCORE_URL,
  REDIS_KEY_HASH_FIELD_URL,
  REDIS_KEY_HASH_FIELDS_URL,
} from '@/api/url/redis';

const tree = [
  {
    key: 'Redis:',
    title: 'Redis',
    count: 8,
    children: [
      {
        key: 'Redis:Test:',
        title: 'Test',
        count: 5,
        children: [
          {
            key: 'Redis:Test:String',
            title: 'String',
            count: 1,
            children: null,
          },
          {
            key: 'Redis:Test:List',
            title: 'List',
            count: 1,
            children: null,
          },
          {
            key: 'Redis:Test:Hash',
            title: 'Hash',
            count: 1,
            children: null,
          },
          {
            key: 'Redis:Test:ZSet',
            title: 'ZSet',
            count: 1,
            children: null,
          },
          {
            key: 'Redis:Test:Set',
            title: 'Set',
            count: 1,
            children: null,
          },
        ],
      },
      {
        key: 'Redis:Log:',
        title: 'Log',
        count: 3,
        children: [
          {
            key: 'Redis:Log:1740249925205061632',
            title: '1740249925205061632',
            count: 1,
            children: null,
          },
          {
            key: 'Redis:Log:1740250346724225024',
            title: '1740250346724225024',
            count: 1,
            children: null,
          },
          {
            key: 'Redis:Log:1740249961435459584',
            title: '1740249961435459584',
            count: 1,
            children: null,
          },
        ],
      },
    ],
  },
];

const list = [
  {
    key: 'Redis:Test:String',
    dataType: 'STRING',
    expire: 6167,
    expireFormat: '10分16秒',
  },
  {
    key: 'Redis:Test:List',
    dataType: 'LIST',
    expire: 6209,
    expireFormat: '10分20秒',
  },
  {
    key: 'Redis:Test:Set',
    dataType: 'SET',
    expire: 6255,
    expireFormat: '10分25秒',
  },
  {
    key: 'Redis:Test:ZSet',
    dataType: 'ZSET',
    expire: 6288,
    expireFormat: '10分28秒',
  },
  {
    key: 'Redis:Test:Hash',
    dataType: 'HASH',
    expire: 6309,
    expireFormat: '10分30秒',
  },
];

const expire = Mock.mock('@integer(1, 2000)');

const infoString = {
  key: 'Redis:Test:String',
  dataType: 'STRING',
  expire: 9982,
  value: {
    field: 'value',
  },
};

const infoList = {
  key: 'Redis:Test:List',
  dataType: 'LIST',
  expire: 9794,
  value: [
    {
      element: 'value#1',
    },
    {
      element: 'value#2',
    },
  ],
};

const infoSet = {
  key: 'Redis:Test:Set',
  dataType: 'SET',
  expire: 9823,
  value: [
    {
      member: 'value2',
    },
    {
      member: 'value1',
    },
  ],
};

const infoZSet = {
  key: 'Redis:Test:ZSet',
  dataType: 'ZSET',
  expire: 9844,
  value: [
    {
      score: 0.01,
      value: {
        field: 'value1',
      },
    },
    {
      score: 0.02,
      value: {
        field: 'value2',
      },
    },
  ],
};

const infoHash = {
  key: 'Redis:Test:Hash',
  dataType: 'HASH',
  expire: 9370,
  value: [
    {
      field: 'field1',
      value: {
        value: 1,
      },
    },
    {
      field: 'field2',
      value: {
        value: 2,
      },
    },
  ],
};

const info = (url: string) => {
  if (url.includes('String')) {
    return infoString;
  }
  if (url.includes('List')) {
    return infoList;
  }
  if (url.includes('ZSet')) {
    return infoZSet;
  }
  if (url.includes('Set')) {
    return infoSet;
  }
  if (url.includes('Hash')) {
    return infoHash;
  }
  return null;
};

setupMock({
  mock: true,
  setup() {
    Mock.mock(new RegExp(`${REDIS_KEYS_TREE_URL}/`), 'get', () => {
      return successRWrap(tree);
    });
    Mock.mock(new RegExp(`${REDIS_KEYS_LIST_URL}/`), 'get', () => {
      return successRWrap(list);
    });
    Mock.mock(new RegExp(`${REDIS_KEY_EXPIRE_URL}/`), 'get', () => {
      return successRWrap(expire);
    });
    Mock.mock(new RegExp(`${REDIS_KEY_EXPIRE_URL}/`), 'put', () => {
      return successRWrap(true);
    });
    Mock.mock(new RegExp(`${REDIS_KEY_INFO_URL}/`), 'delete', () => {
      return successRWrap(null);
    });
    Mock.mock(
      new RegExp(`${REDIS_KEY_INFO_URL}/`),
      'get',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(new RegExp(`${REDIS_HAS_KEY_URL}/`), 'get', () => {
      return successRWrap(false);
    });
    Mock.mock(`${REDIS_URL}`, 'post', (params: MockParams) => {
      return successRWrap(info(params.url));
    });
    Mock.mock(
      new RegExp(`${REDIS_KEY_STRING_URL}/`),
      'put',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_LIST_ELEMENT_URL}/`),
      'post',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_LIST_ELEMENT_URL}/`),
      'put',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_LIST_ELEMENT_URL}/`),
      'delete',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_SET_MEMBERS_URL}/`),
      'post',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_SET_MEMBERS_URL}/`),
      'delete',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_ZSET_MEMBERS_URL}/`),
      'post',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_ZSET_MEMBER_SCORE_URL}/`),
      'put',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_ZSET_MEMBERS_URL}/`),
      'delete',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_HASH_FIELDS_URL}/`),
      'post',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_HASH_FIELD_URL}/`),
      'put',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
    Mock.mock(
      new RegExp(`${REDIS_KEY_HASH_FIELDS_URL}/`),
      'delete',
      (params: MockParams) => {
        return successRWrap(info(params.url));
      }
    );
  },
});
