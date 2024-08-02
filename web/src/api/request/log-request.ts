import { LOG_REQUEST_PAGE_URL } from '@/api/url/log-request';
import { PageData } from '@/global/body';
import { get } from '@/api/request/request';

export interface LogRequestQuery {
  /**
   * 接口名称
   */
  apiName: string;

  /**
   * 响应状态，true-成功，false-失败
   */
  responseSuccess?: string;

  /**
   * 响应异常码
   */
  responseErrorCode?: string;

  /**
   * 响应异常信息
   */
  responseErrorMsg?: string;

  /**
   * 客户端IP
   */
  clientIp: string;

  /**
   * 租户ID
   */
  tenantIds: Array<string>;

  /**
   * 用户名
   */
  loginName?: string;

  /**
   * 账号ID
   */
  userId: string;

  /**
   * 请求方式
   */
  servletMethods: Array<string>;

  /**
   * 请求地址
   */
  servletPath: string;

  /**
   * 操作时间
   */
  requestTimeRange: Array<string>;

  /**
   * 响应耗时(毫秒) 开始
   */
  responseTimeRange: Array<number>;

  /**
   * 类方法
   */
  classMethod: string;

  /**
   * 请求参数
   */
  classParams: string;

  /**
   * 请求平台
   */
  userAgent: string;

  /**
   * 请求参数
   */
  requestParams: string;

  /**
   * 请求body
   */
  requestBody: string;

  /**
   * 请求路径
   */
  requestUrlInfo: string;

  /**
   * 客户端信息
   */
  clientInfo: string;

  /**
   * 服务端信息
   */
  serverInfo: string;
}

export interface LogRequestPageQuery extends Partial<LogRequestQuery> {
  current?: number;
  pageSize?: number;
}

export interface LogRequestPageResponseBody {
  /**
   * 主键ID
   */
  id: number;

  /**
   * 接口名称
   */
  apiName: string;

  /**
   * 响应状态，true-成功，false-失败
   */
  responseSuccess: boolean;

  /**
   * 响应异常码
   */
  responseErrorCode: string;

  /**
   * 响应异常信息
   */
  responseErrorMsg: string;

  /**
   * 客户端IP
   */
  clientIp: string;

  /**
   * 租户ID
   */
  tenantId: string;

  /**
   * 租户名称
   */
  tenantName?: string;

  /**
   * 用户信息
   */
  userInfo: string;

  /**
   * 请求方式
   */
  servletMethod: string;

  /**
   * 请求地址
   */
  servletPath: string;

  /**
   * 响应耗时格式化
   */
  responseTimeFormat: string;

  /**
   * 操作时间
   */
  requestTime: string;

  /**
   * 类方法
   */
  classMethod: string;

  /**
   * 请求参数
   */
  classParams: string;

  /**
   * 请求平台
   */
  userAgent: string;

  /**
   * 请求参数
   */
  requestParams: string;

  /**
   * 请求body
   */
  requestBody: string;

  /**
   * 请求路径
   */
  requestUrlInfo: string;

  /**
   * 客户端信息
   */
  clientInfo: string;

  /**
   * 服务端信息
   */
  serverInfo: string;
}

export function logRequestPageApi(params: LogRequestPageQuery) {
  return get<PageData<LogRequestPageResponseBody>>(
    LOG_REQUEST_PAGE_URL,
    params
  );
}
