import { get, post } from '@/api/request/request';
import MQ_URL from '@/api/url/mq';
import { RedisLogBody } from '@/global/body';

export interface MqRequestBody {
  info: string;
}

export interface MqResponseBody {
  consumerThreadName: string;
  info: string;
  producerDateTime: string;
  consumerDateTime: string;
}

export function mqSendApi(id: string, requestBody: MqRequestBody) {
  return post(`${MQ_URL}/${id}`, requestBody);
}

export function mqLogApi(id: string) {
  return get<RedisLogBody<MqResponseBody>>(`${MQ_URL}/${id}`);
}
