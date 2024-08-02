import { get, put, deleteRequest } from '@/api/request/request';
import { PageData, DataBody } from '@/global/body';
import {
  NOTICE_USER_URL,
  NOTICE_USER_PAGE_URL,
  NOTICE_USER_UNREAD_COUNT_URL,
  NOTICE_USER_INFO_URL,
  NOTICE_USER_READ_URL,
  NOTICE_USER_READ_ALL_URL,
} from '@/api/url/notice-user';

export interface NoticeUserQueryParams {
  title: string;
  noticeType?: number;
  readState?: number;
  sendTimeRang: string[];
  readTimeRang: string[];
}

export interface NoticeUserPageParams extends Partial<NoticeUserQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface NoticeUserResponseBody {
  id: number;
  title: string;
  noticeType: number;
  readState: number;
  sendTime: string;
  readTime: string;
}

export interface NoticeUserInfoResponseBody extends NoticeUserResponseBody {
  html: string;
}

export function noticeUserPageApi(requestParams: NoticeUserPageParams) {
  return get<PageData<NoticeUserResponseBody>>(
    NOTICE_USER_PAGE_URL,
    requestParams
  );
}

export function noticeUserUnreadCountApi() {
  return get(NOTICE_USER_UNREAD_COUNT_URL);
}

export function noticeUserInfoApi(id: number | null) {
  return get<NoticeUserInfoResponseBody>(`${NOTICE_USER_INFO_URL}/${id}`);
}

export function noticeUserReadApi(requestBody: DataBody<number[]>) {
  return put(NOTICE_USER_READ_URL, requestBody);
}

export function noticeUserReadAllApi() {
  return put(NOTICE_USER_READ_ALL_URL);
}

export function noticeUserDeleteApi(id: number | null) {
  return deleteRequest(`${NOTICE_USER_URL}/${id}`);
}

export function noticeUserBatchDeleteApi(requestBody: DataBody<number[]>) {
  return deleteRequest(NOTICE_USER_URL, requestBody);
}
