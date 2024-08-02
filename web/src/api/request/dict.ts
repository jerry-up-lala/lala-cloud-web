import { get, post, put, deleteRequest } from '@/api/request/request';
import { DataBody, DataIdBody } from '@/global/body';
import { DictData } from '@/store/modules/dict/types';
import type { CascaderOption } from '@arco-design/web-vue/es/cascader';
import {
  DICT_URL,
  DICT_ITEM_URL,
  DICT_LIST_URL,
  DICT_INFO_URL,
  DICT_REFRESH_CACHE_URL,
  DICT_VERIFY_NAME_URL,
  DICT_VERIFY_KEY_URL,
  DICT_ITEM_TREE_URL,
  DICT_ITEM_CASCADER_URL,
  DICT_ITEM_INFO_URL,
  DICT_ITEM_VERIFY_LABEL_URL,
  DICT_ITEM_VERIFY_VALUE_URL,
  DICT_ITEM_ALL_URL,
} from '@/api/url/dict';

export interface DictResponseBody {
  id: number;
  dictName: string;
  dictKey: string;
}

export interface DictSaveRequestBody {
  dictName: string;
  dictKey: string;
}

export interface DictItemTreeResponseBody {
  id: number;
  dictId: number;
  parentId?: number;
  label: string;
  value: string;
  sortOrder: number;
  dictName: string;
  dictKey: string;
  children: DictItemTreeResponseBody[];
}

export interface DictItemInfoResponseBody {
  id: number;
  dictId: number;
  parentId?: number;
  label: string;
  value: string;
  sortOrder: number;
  dictName: string;
  dictKey: string;
}

export interface DictItemSaveVerifyParams {
  id?: number;
  parentId?: number;
  value: string;
}

export interface DictItemSaveRequestBody {
  parentId?: number;
  label: string;
  value: string;
  sortOrder: number;
}

export function dictListApi(requestParams?: DataBody<string>) {
  return get<DictResponseBody[]>(DICT_LIST_URL, requestParams);
}

export function dictInfoApi(id?: number) {
  return get<DictResponseBody>(`${DICT_INFO_URL}/${id}`);
}

export function dictVerifyNameApi(
  requestBody: DataIdBody<number | undefined, string>
) {
  return get(DICT_VERIFY_NAME_URL, requestBody);
}

export function dictVerifyKeyApi(
  requestBody: DataIdBody<number | undefined, string>
) {
  return get(DICT_VERIFY_KEY_URL, requestBody);
}

export function dictAddApi(requestBody: DictSaveRequestBody) {
  return post(DICT_URL, requestBody);
}

export function dictUpdateApi(id: number, requestBody: DictSaveRequestBody) {
  return put(`${DICT_URL}/${id}`, requestBody);
}

export function dictDeleteApi(id?: number) {
  return deleteRequest(`${DICT_URL}/${id}`);
}

export function dictRefreshCacheApi() {
  return post(DICT_REFRESH_CACHE_URL);
}

export function dictItemTreeApi(dictId?: number) {
  return get<DictItemTreeResponseBody[]>(`${DICT_ITEM_TREE_URL}/${dictId}`);
}

export function dictItemCascaderApi(dictId?: number) {
  return get<CascaderOption[]>(`${DICT_ITEM_CASCADER_URL}/${dictId}`);
}

export function dictItemInfoApi(id: number) {
  return get<DictItemInfoResponseBody>(`${DICT_ITEM_INFO_URL}/${id}`);
}

export function dictItemVerifyLabelApi(
  dictId?: number,
  params?: DictItemSaveVerifyParams
) {
  return get(`${DICT_ITEM_VERIFY_LABEL_URL}/${dictId}`, params);
}

export function dictItemVerifyValueApi(
  dictId?: number,
  params?: DictItemSaveVerifyParams
) {
  return get(`${DICT_ITEM_VERIFY_VALUE_URL}/${dictId}`, params);
}

export function dictItemAddApi(
  dictId: number | undefined,
  requestBody: DictItemSaveRequestBody
) {
  return post(`${DICT_ITEM_URL}/${dictId}`, requestBody);
}

export function dictItemUpdateApi(
  id: number | undefined,
  requestBody: DictItemSaveRequestBody
) {
  return put(`${DICT_ITEM_URL}/${id}`, requestBody);
}

export function dictItemDeleteApi(id?: number) {
  return deleteRequest(`${DICT_ITEM_URL}/${id}`);
}

export function dictItemAllApi() {
  return get<DictData>(DICT_ITEM_ALL_URL);
}
