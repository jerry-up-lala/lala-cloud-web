import { get, post, put, deleteRequest } from '@/api/request/request';
import { PageData, DataIdBody, DataBody } from '@/global/body';
import {
  TENANT_URL,
  TENANT_LIST_URL,
  TENANT_PAGE_URL,
  TENANT_INFO_URL,
  TENANT_PASSWORD_URL,
  TENANT_VERIFY_URL,
} from '@/api/url/tenant';

export interface TenantQuery {
  tenantName: string;
  state: string | undefined;
}

export interface TenantPageQuery extends Partial<TenantQuery> {
  current?: number;
  pageSize?: number;
}

export interface TenantInfoResponseBody {
  id: string;
  tenantName: string;
  state: boolean;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
  userId: string;
  loginName: string;
  realName: string;
  userState: boolean;
}

export interface TenantSaveRequestBody {
  tenantName: string;
  state: boolean;
}

export interface TenantAddRequestBody extends Partial<TenantSaveRequestBody> {
  user?: {
    loginName: string;
    passWord: string;
    realName: string;
  };
}

export function tenantListApi(query?: TenantPageQuery) {
  return get<TenantInfoResponseBody[]>(TENANT_LIST_URL, query);
}

export function tenantPageApi(query: TenantPageQuery) {
  return get<PageData<TenantInfoResponseBody>>(TENANT_PAGE_URL, query);
}

export function tenantInfoApi(id: string) {
  return get<TenantInfoResponseBody>(TENANT_INFO_URL + id);
}

export function tenantPasswordApi(id: string) {
  return get<string>(TENANT_PASSWORD_URL + id);
}

export function tenantVerifyApi(requestBody: DataIdBody<string, string>) {
  return get(TENANT_VERIFY_URL, requestBody);
}

export function tenantAddApi(requestBody: TenantAddRequestBody) {
  return post(TENANT_URL, requestBody);
}

export function tenantUpdateApi(
  id: string,
  requestBody: TenantSaveRequestBody
) {
  return put(`${TENANT_URL}/${id}`, requestBody);
}

export function tenantBatchDeleteApi(requestBody: DataBody<Array<string>>) {
  return deleteRequest(TENANT_URL, requestBody);
}

export function tenantDeleteApi(id: string) {
  return deleteRequest(`${TENANT_URL}/${id}`);
}
