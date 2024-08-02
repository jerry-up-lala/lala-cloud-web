import { get, post, put } from '@/api/request/request';
import { PageData, DataIdBody } from '@/global/body';
import {
  ROLE_URL,
  ROLE_LIST_URL,
  ROLE_PAGE_URL,
  ROLE_INFO_URL,
  ROLE_VERIFY_URL,
} from '@/api/url/role';

export interface RoleQueryParams {
  roleName: string;
  description: string;
  state?: string;
  createTimeRang: string[];
}

export interface RolePageQueryParams extends Partial<RoleQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface RoleResponseBody {
  id: number;
  roleName: string;
  description: string;
  state?: boolean;
  createTime: string;
}

export interface RoleInfoResponseBody extends RoleResponseBody {
  menuIds: number[];
}

export interface RoleSaveRequestBody {
  roleName: string;
  description: string;
  state?: boolean;
  menuIds: number[];
}

export function roleListApi(query?: RoleQueryParams) {
  return get<Array<RoleResponseBody>>(ROLE_LIST_URL, query);
}

export function rolePageApi(query: RolePageQueryParams) {
  return get<PageData<RoleResponseBody>>(ROLE_PAGE_URL, query);
}

export function roleInfoApi(id: number | null) {
  return get<RoleInfoResponseBody>(ROLE_INFO_URL + id);
}

export function roleVerifyApi(requestBody: DataIdBody<number | null, string>) {
  return get(ROLE_VERIFY_URL, requestBody);
}

export function roleAddApi(requestBody: RoleSaveRequestBody) {
  return post(ROLE_URL, requestBody);
}

export function roleUpdateApi(id: number, requestBody: RoleSaveRequestBody) {
  return put(`${ROLE_URL}/${id}`, requestBody);
}
