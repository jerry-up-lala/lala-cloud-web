import { get, post, put } from '@/api/request/request';
import { MenuInfoResponseBody } from '@/api/request/menu';
import { PageData, DataIdBody } from '@/global/body';
import {
  USER_URL,
  USER_LIST_URL,
  USER_PAGE_URL,
  USER_INFO_URL,
  USER_PASSWORD_URL,
  USER_VERIFY_URL,
  USER_STATE_URL,
} from '@/api/url/user';

export interface UserQueryParams {
  loginName: string;
  realName: string;
  state?: string;
  tenantAdmin?: string;
  createTimeRang: string[];
}

export interface UserPageQueryParams extends Partial<UserQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface UserResponseBody {
  id: string;
  loginName: string;
  realName: string;
  state?: boolean;
  tenantAdmin?: boolean;
  mail?: string;
  nickName?: string;
  intro?: string;
  createTime: string;
  effectiveRoleNames?: string[];
  invalidRoleNames?: string[];
}

export interface UserInfoResponseBody extends UserResponseBody {
  roleIds?: number[];
  menuButtonList?: MenuInfoResponseBody[];
}

export interface UserSaveRequestBody {
  loginName: string;
  passWord: string;
  realName: string;
  state?: boolean;
  mail?: string;
  nickName?: string;
  intro?: string;
  roleIds: string[];
}

export interface UserStateRequestBody {
  userIdList: string[];
  state: boolean;
}

export function userListApi(query?: UserQueryParams) {
  return get<UserResponseBody[]>(USER_LIST_URL, query);
}

export function userPageApi(query: UserPageQueryParams) {
  return get<PageData<UserResponseBody>>(USER_PAGE_URL, query);
}

export function userInfoApi(id: string) {
  return get<UserInfoResponseBody>(USER_INFO_URL + id);
}

export function userPasswordApi(id: string) {
  return get<string>(USER_PASSWORD_URL + id);
}

export function userVerifyApi(requestBody: DataIdBody<string | null, string>) {
  return get(USER_VERIFY_URL, requestBody);
}

export function userAddApi(requestBody: UserSaveRequestBody) {
  return post(USER_URL, requestBody);
}

export function userUpdateApi(id: string, requestBody: UserSaveRequestBody) {
  return put(`${USER_URL}/${id}`, requestBody);
}

export function userStateApi(requestBody: UserStateRequestBody) {
  return post(USER_STATE_URL, requestBody);
}
