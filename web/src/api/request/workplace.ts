import { get } from '@/api/request/request';
import {
  WORK_PLACE_STATISTIC_URL,
  WORK_PLACE_LOG_SUM_URL,
  WORK_PLACE_LOG_SERVLET_METHOD_URL,
  WORK_PLACE_LOG_API_NAME_URL,
  WORK_PLACE_NOTICE_URL,
} from '@/api/url/workplace';

export interface WorkplaceStatisticResponseBody {
  menu: number;
  apiCount: number;
  apiDoc: string;
  request: number;
  requestQoq: number;
}

export interface WorkplaceNoticeResponseBody {
  id: number;
  title: string;
  noticeType: number;
  sendState: number;
  sendTime: string;
}

export function workplaceStatisticApi() {
  return get<WorkplaceStatisticResponseBody>(WORK_PLACE_STATISTIC_URL);
}

export function workplaceLogSumApi() {
  return get(WORK_PLACE_LOG_SUM_URL);
}

export function workplaceLogServletMethodApi() {
  return get(WORK_PLACE_LOG_SERVLET_METHOD_URL);
}

export function workplaceLogApiNameApi() {
  return get(WORK_PLACE_LOG_API_NAME_URL);
}

export function workplaceNoticeApi() {
  return get<WorkplaceNoticeResponseBody[]>(WORK_PLACE_NOTICE_URL);
}
