import { LoginState } from '@/store/modules/user/types';
import { LOGIN_URL, OPEN_LOGIN_URL } from '@/api/url/login';
import { get, post, deleteRequest } from '@/api/request/request';

export interface LoginRequestBody {
  tenantName: string;
  loginName: string;
  passWord: string;
}

export function loginApi(data: LoginRequestBody) {
  return post<string>(OPEN_LOGIN_URL, data);
}

export function loginInfoApi() {
  return get<LoginState>(LOGIN_URL);
}

export function loginoutApi() {
  return deleteRequest(LOGIN_URL);
}
