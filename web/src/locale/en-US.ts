import localeWorkplace from './en-US/workplace';
import localeCommon from './en-US/common';
import localeFooter from './en-US/footer';
import localeSettings from './en-US/settings';
import localeLogin from './en-US/login';
import localeMenu from './en-US/menu';
import localeTab from './en-US/tab';
import localeSystemTenant from './en-US/system/tenant';
import localeSystemMenu from './en-US/system/menu';
import localeSystemUser from './en-US/system/user';
import localeSystemRole from './en-US/system/role';
import localeSystemNotice from './en-US/system/notice';
import localeSystemDict from './en-US/dev/dict';
import localeBasicCrud from './en-US/basic/crud';
import localeBasicHttp from './en-US/basic/http';
import localeBasicConcurrent from './en-US/basic/concurrent';
import localeBasicMq from './en-US/ware/mq';
import localeBasicRedis from './en-US/ware/redis';
import localeDevLogRequest from './en-US/dev/log-request';
import localeDevGen from './en-US/dev/gen';

export default {
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
  ...localeWorkplace,
  ...localeDevLogRequest,
  ...localeDevGen,
};
