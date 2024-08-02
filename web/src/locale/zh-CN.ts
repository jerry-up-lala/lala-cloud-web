import localeWorkplace from './zh-CN/workplace';
import localeCommon from './zh-CN/common';
import localeFooter from './zh-CN/footer';
import localeSettings from './zh-CN/settings';
import localeLogin from './zh-CN/login';
import localeMenu from './zh-CN/menu';
import localeTab from './zh-CN/tab';
import localeSystemTenant from './zh-CN/system/tenant';
import localeSystemMenu from './zh-CN/system/menu';
import localeSystemUser from './zh-CN/system/user';
import localeSystemRole from './zh-CN/system/role';
import localeSystemNotice from './zh-CN/system/notice';
import localeSystemDict from './zh-CN/system/dict';
import localeBasicCrud from './zh-CN/basic/crud';
import localeBasicHttp from './zh-CN/basic/http';
import localeBasicConcurrent from './zh-CN/basic/concurrent';
import localeBasicMq from './zh-CN/ware/mq';
import localeBasicRedis from './zh-CN/ware/redis';
import localeDevLogRequest from './zh-CN/dev/log-request';
import localeDevGen from './zh-CN/dev/gen';

export default {
  ...localeWorkplace,
  ...localeCommon,
  ...localeFooter,
  ...localeSettings,
  ...localeLogin,
  ...localeMenu,
  ...localeTab,
  ...localeSystemTenant,
  ...localeSystemMenu,
  ...localeSystemUser,
  ...localeSystemRole,
  ...localeSystemNotice,
  ...localeSystemDict,
  ...localeBasicCrud,
  ...localeBasicHttp,
  ...localeBasicConcurrent,
  ...localeBasicMq,
  ...localeBasicRedis,
  ...localeDevLogRequest,
  ...localeDevGen,
};
