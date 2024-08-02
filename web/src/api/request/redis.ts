import { DataBody } from '@/global/body';
import { get, post, put, deleteRequest } from '@/api/request/request';
import {
  REDIS_URL,
  REDIS_KEYS_TREE_URL,
  REDIS_KEYS_LIST_URL,
  REDIS_KEY_EXPIRE_URL,
  REDIS_HAS_KEY_URL,
  REDIS_KEY_INFO_URL,
  REDIS_KEY_STRING_URL,
  REDIS_KEY_LIST_ELEMENT_URL,
  REDIS_KEY_SET_MEMBERS_URL,
  REDIS_KEY_ZSET_MEMBERS_URL,
  REDIS_KEY_ZSET_MEMBER_SCORE_URL,
  REDIS_KEY_HASH_FIELD_URL,
  REDIS_KEY_HASH_FIELDS_URL,
} from '@/api/url/redis';

/**
 * redis树信息
 */
export interface KeyTreeResponseBody {
  /**
   * 键
   */
  key: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 子列表
   */
  children: KeyTreeResponseBody[] | null;
}

/**
 * redis键信息
 */
export interface KeyListResponseBody {
  /**
   * 键
   */
  key: string;
  /**
   * 数据类型
   */
  dataType: string;
  /**
   * 过期时间，单位: 秒
   */
  expire: number;
  /**
   * 过期时间，格式化
   */
  expireFormat: number;
}

/**
 * 有序集合，dataType=ZSET
 */
export interface KeyInfoZSetBody {
  /**
   * 优先级分数
   */
  score?: number;
  /**
   * 值
   */
  value?: any;
}

/**
 * Hash，dataType=HASH
 */
export interface KeyInfoHashBody {
  /**
   * 字段名
   */
  field: string;
  /**
   * 字段值
   */
  value: any;
}

/**
 * redis键值信息
 */
export interface KeyInfoBody {
  /**
   * key
   */
  key: string;

  /**
   * 数据类型
   */
  dataType: string;

  /**
   * 过期时间，单位: 秒
   */
  expire?: number;
  /**
   * 值
   */
  value: any | any[] | KeyInfoZSetBody[] | KeyInfoHashBody | null;
}

export interface KeyInfoListAddRequestBody extends DataBody<any> {
  /**
   * 插入类型
   */
  pushType: number;
}

export interface KeyInfoListUpdateRequestBody extends DataBody<any> {
  /**
   * 索引
   */
  index: number;
}

export interface KeyInfoListDeleteRequestBody {
  /**
   * 插入类型
   */
  pushType: number;
  /**
   * 数量
   */
  count?: number;
}

export function keysTreeApi(pattern: string) {
  return get<KeyTreeResponseBody[]>(`${REDIS_KEYS_TREE_URL}/${pattern}`);
}

export function keysListApi(pattern: string) {
  return get<KeyListResponseBody[]>(`${REDIS_KEYS_LIST_URL}/${pattern}`);
}

export function keyExpireInfoApi(key: string) {
  return get<number>(`${REDIS_KEY_EXPIRE_URL}/${key}`);
}

export function keySetExpireApi(key: string, requestBody: DataBody<any>) {
  return put<boolean>(`${REDIS_KEY_EXPIRE_URL}/${key}`, requestBody);
}

export function keyDeleteApi(key: string) {
  return deleteRequest(`${REDIS_KEY_INFO_URL}/${key}`);
}

export function keyInfoApi(key: string) {
  return get<KeyInfoBody>(`${REDIS_KEY_INFO_URL}/${key}`);
}

export function hasKeyApi(key: string) {
  return get<boolean>(`${REDIS_HAS_KEY_URL}/${key}`);
}

export function keyAddApi(keyInfo: KeyInfoBody) {
  return post<KeyInfoBody>(`${REDIS_URL}`, keyInfo);
}

export function keyStringUpdateApi(key: string, requestBody: DataBody<any>) {
  return put<KeyInfoBody>(`${REDIS_KEY_STRING_URL}/${key}`, requestBody);
}

export function keyListAddApi(
  key: string,
  requestBody: KeyInfoListAddRequestBody
) {
  return post<KeyInfoBody>(`${REDIS_KEY_LIST_ELEMENT_URL}/${key}`, requestBody);
}

export function keyListUpdateApi(
  key: string,
  requestBody: KeyInfoListUpdateRequestBody
) {
  return put<KeyInfoBody>(`${REDIS_KEY_LIST_ELEMENT_URL}/${key}`, requestBody);
}

export function keyListDeleteApi(
  key: string,
  requestBody: KeyInfoListDeleteRequestBody
) {
  return deleteRequest<KeyInfoBody>(
    `${REDIS_KEY_LIST_ELEMENT_URL}/${key}`,
    requestBody
  );
}

export function keySetAddApi(key: string, requestBody: DataBody<any>) {
  return post<KeyInfoBody>(`${REDIS_KEY_SET_MEMBERS_URL}/${key}`, requestBody);
}

export function keySetDeleteApi(key: string, requestBody: DataBody<any[]>) {
  return deleteRequest<KeyInfoBody>(
    `${REDIS_KEY_SET_MEMBERS_URL}/${key}`,
    requestBody
  );
}

export function keyZSetAddApi(
  key: string,
  requestBody: DataBody<KeyInfoZSetBody[]>
) {
  return post<KeyInfoBody>(`${REDIS_KEY_ZSET_MEMBERS_URL}/${key}`, requestBody);
}

export function keyZSetScoreApi(
  key: string,
  requestBody: DataBody<KeyInfoZSetBody>
) {
  return put<KeyInfoBody>(
    `${REDIS_KEY_ZSET_MEMBER_SCORE_URL}/${key}`,
    requestBody
  );
}

export function keyZSetDeleteApi(key: string, requestBody: DataBody<any[]>) {
  return deleteRequest<KeyInfoBody>(
    `${REDIS_KEY_ZSET_MEMBERS_URL}/${key}`,
    requestBody
  );
}

export function keyHashAddApi(
  key: string,
  requestBody: DataBody<KeyInfoHashBody[]>
) {
  return post<KeyInfoBody>(`${REDIS_KEY_HASH_FIELDS_URL}/${key}`, requestBody);
}

export function keyHashUpdateApi(
  key: string,
  requestBody: DataBody<KeyInfoHashBody>
) {
  return put<KeyInfoBody>(`${REDIS_KEY_HASH_FIELD_URL}/${key}`, requestBody);
}

export function keyHashDeleteApi(key: string, requestBody: DataBody<string[]>) {
  return deleteRequest<KeyInfoBody>(
    `${REDIS_KEY_HASH_FIELDS_URL}/${key}`,
    requestBody
  );
}
