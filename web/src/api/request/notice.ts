import { get, post, put, deleteRequest } from '@/api/request/request';
import { PageData, DataBody } from '@/global/body';
import {
  NOTICE_URL,
  NOTICE_PAGE_URL,
  NOTICE_INFO_URL,
  NOTICE_SEND_URL,
  NOTICE_USER_PAGE_URL,
} from '@/api/url/notice';

export interface NoticeQueryParams {
  title: string;
  noticeType?: number;
  sendState?: number;
  sendTimeRang: string[];
}

export interface NoticePageParams extends Partial<NoticeQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface NoticeUserAllQueryParams {
  noticeId?: number;
  loginName: string;
  realName: string;
  readState?: number;
  readTimeRang: string[];
}

export interface NoticeUserAllPageParams
  extends Partial<NoticeUserAllQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface NoticeResponseBody {
  id: number;
  title: string;
  noticeType: number;
  sendState: number;
  sendTime: string;
}

export interface NoticeInfoResponseBody extends NoticeResponseBody {
  html: string;
  userIds: string[];
}

export interface NoticeUserAllResponseBody {
  id: number;
  userId: string;
  readState: number;
  readTime: string;
  loginName: string;
  realName: string;
}

export interface NoticeSaveRequestBody {
  title: string;
  noticeType: number;
  html: string;
  userIds: string[];
}

export function noticePageApi(requestParams: NoticePageParams) {
  return get<PageData<NoticeResponseBody>>(NOTICE_PAGE_URL, requestParams);
}

export function noticeInfoApi(id: number | null) {
  return get<NoticeInfoResponseBody>(`${NOTICE_INFO_URL}/${id}`);
}

export function noticeUserPageApi(requestParams: NoticeUserAllPageParams) {
  return get<PageData<NoticeUserAllResponseBody>>(
    NOTICE_USER_PAGE_URL,
    requestParams
  );
}

export function noticeAddApi(requestBody: NoticeSaveRequestBody) {
  return post(NOTICE_URL, requestBody);
}

export function noticeUpdateApi(
  id: number,
  requestBody: NoticeSaveRequestBody
) {
  return put(`${NOTICE_URL}/${id}`, requestBody);
}

export function noticeSendApi(id: number | null) {
  return put(`${NOTICE_SEND_URL}/${id}`);
}

export function noticeDeleteApi(id: number | null) {
  return deleteRequest(`${NOTICE_URL}/${id}`);
}

export function noticeBatchDeleteApi(requestBody: DataBody<number[]>) {
  return deleteRequest(NOTICE_URL, requestBody);
}
