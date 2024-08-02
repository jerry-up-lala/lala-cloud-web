import { get, post } from '@/api/request/request';
import CONCURRENT_URL from '@/api/url/concurrent';
import { RedisLogBody } from '@/global/body';

export interface ConcurrentRequestBody {
  corePoolSize: number;
  maximumPoolSize: number;
  keepAliveTime: number;
  workQueueType: number;
  workQueueSize: number;
  rejectedExecutionType: number;
  runTotal: number;
}

export interface ConcurrentResponseBody {
  threadName: string;
  runDateTime: string;
}

export function concurrentRunApi(id: string, query: ConcurrentRequestBody) {
  return post(`${CONCURRENT_URL}/${id}`, query);
}

export function concurrentLogApi(id: string) {
  return get<RedisLogBody<ConcurrentResponseBody>>(`${CONCURRENT_URL}/${id}`);
}
