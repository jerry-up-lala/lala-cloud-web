import Mock from 'mockjs';
import setupMock, {
  MockParams,
  successRWrap,
  errorRWrap,
} from '@/mock/setup-mock';
import { isLogin } from '@/utils/auth';
import { jsonParse } from '@/utils/json';
import { LOGIN_URL, OPEN_LOGIN_URL } from '@/api/url/login';

const loginInfo = {
  data: {
    userId: '1698900184022351875',
    loginName: 'admin',
    realName: '系统管理员',
    tenantId: null,
    accessCodes: [
      'DASHBOARD',
      'WORKPLACE',
      'CRUD',
      'CRUD:ARCO',
      'CRUD:ARCO:QUERY',
      'CRUD:ARCO:EXPORT',
      'CRUD:ARCO:DELETE',
      'CRUD:ARCO:BATCH:DELETE',
      'CRUD:ARCO:ADD',
      'CRUD:ARCO:UPDATE',
      'CRUD:ARCO:UPLOAD',
      'CRUD:COMPONENTS',
      'CRUD:COMPONENTS:QUERY',
      'CRUD:COMPONENTS:EXPORT',
      'CRUD:COMPONENTS:DELETE',
      'CRUD:COMPONENTS:BATCH:DELETE',
      'CRUD:COMPONENTS:ADD',
      'CRUD:COMPONENTS:UPDATE',
      'CRUD:COMPONENTS:UPLOAD',
      'CRUD:GEN',
      'CRUD:GEN:QUERY',
      'CRUD:GEN:EXPORT',
      'CRUD:GEN:DELETE',
      'CRUD:GEN:BATCH:DELETE',
      'CRUD:GEN:ADD',
      'CRUD:GEN:UPDATE',
      'CRUD:GEN:UPLOAD',
      'BASIC',
      'HTTP',
      'CONCURRENT',
      'WARE',
      'REDIS',
      'REDIS:QUERY',
      'REDIS:ADD',
      'REDIS:INFO',
      'REDIS:UPDATE',
      'REDIS:EXPIRE',
      'REDIS:DELETE',
      'MQ',
      'SYSTEM',
      'TENANT',
      'TENANT:QUERY',
      'TENANT:INFO',
      'TENANT:PASSWORD',
      'TENANT:ADD',
      'TENANT:UPDATE',
      'TENANT:DELETE',
      'TENANT:BATCH:DELETE',
      'MENU',
      'MENU:QUERY',
      'USER',
      'USER:QUERY',
      'USER:PASSWORD',
      'USER:STATE:ACTIVATION',
      'USER:INFO',
      'USER:ADD',
      'USER:UPDATE',
      'ROLE',
      'ROLE:QUERY',
      'ROLE:INFO',
      'ROLE:ADD',
      'ROLE:UPDATE',
      'NOTICE',
      'NOTICE:QUERY',
      'NOTICE:INFO',
      'NOTICE:SEND',
      'NOTICE:DELETE',
      'NOTICE:BATCH:DELETE',
      'NOTICE:USER',
      'NOTICE:ADD',
      'NOTICE:UPDATE',
      'DEV',
      'LOG:REQUEST',
      'LOG:REQUEST:QUERY',
      'LOG:REQUEST:INFO',
      'DICT',
      'DICT:QUERY',
      'DICT:REFRESH:CACHE',
      'DICT:ADD',
      'DICT:UPDATE',
      'DICT:DELETE',
      'DICT:ITEM:TREE',
      'DICT:ITEM:ADD',
      'DICT:ITEM:UPDATE',
      'DICT:ITEM:DELETE',
      'GEN',
      'GEN:QUERY',
      'GEN:OPERATE',
      'DEV:EMPTY',
      'CENTER',
      'EXTERNAL',
      'ARCOWEBSITE',
      'JERRYUP',
    ],
  },
  error: null,
};

setupMock({
  mock: true,
  setup() {
    // 登录
    Mock.mock(new RegExp(OPEN_LOGIN_URL), 'post', (params: MockParams) => {
      const { tenantName, loginName, passWord } = jsonParse(params.body);
      if (
        tenantName === '样例集团' &&
        loginName === 'tenant' &&
        passWord === 'lala'
      ) {
        return successRWrap(Mock.mock('@word'));
      }
      return errorRWrap(null, '账号或者密码错误');
    });

    // 用户信息
    Mock.mock(new RegExp(LOGIN_URL), 'get', () => {
      if (isLogin()) {
        return loginInfo;
      }
      return errorRWrap(null, '请登录', 100001);
    });

    Mock.mock(new RegExp(LOGIN_URL), 'delete', () => {
      return successRWrap(null);
    });
  },
});
