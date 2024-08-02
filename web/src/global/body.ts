import { jsonParse } from '@/utils/json';

export interface DataBody<VALUE> {
  value: VALUE;
}

export interface DataIdBody<ID, VALUE> extends DataBody<VALUE> {
  id: ID;
}

export interface RedisLogBody<Infos> {
  key: string;
  infos: Array<Infos>;
}

export interface ErrorR {
  code: string;
  msg: string;
}

export interface R<Data = unknown> {
  data: Data;
  error?: ErrorR | null;
}

export interface PageData<Data = unknown> {
  list: Data[];
  total: number;
}

export interface PageR<Data> extends R {
  data: PageData<Data>;
  error?: ErrorR | null;
}

export const apiErrorRMsg = (err: any): string => {
  const message = jsonParse(err?.message);
  return (message as ErrorR).msg;
};
