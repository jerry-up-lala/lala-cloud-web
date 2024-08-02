import { get, post } from '@/api/request/request';
import HTTP_URL from '@/api/url/http';
import { RedisLogBody } from '@/global/body';

export interface HttpSendRequestBody {
  httpUrl: string;
  count?: number;
}

export interface HttpResponseBody {
  threadName: string;
  sendResult: string;
  sendDateTime: string;
}

export function httpSendApi(id: string, requestBody: HttpSendRequestBody) {
  return post(`${HTTP_URL}/${id}`, requestBody);
}

export function httpLogApi(id: string) {
  return get<RedisLogBody<HttpResponseBody>>(`${HTTP_URL}/${id}`);
}
