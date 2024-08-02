import Mock from 'mockjs';

import '@/mock/common';
import '@/mock/login';
import '@/mock/workplace';
import '@/mock/user-setting';
import '@/mock/user-personal';
import '@/mock/menu';
import '@/mock/tenant';
import '@/mock/user';
import '@/mock/role';
import '@/mock/log-request';
import '@/mock/notice';
import '@/mock/notice-user';
import '@/mock/crud';
import '@/mock/http';
import '@/mock/concurrent';
import '@/mock/mq';
import '@/mock/redis';
import '@/mock/gen';
import '@/mock/dict';

Mock.setup({
  timeout: '600-1000',
});
