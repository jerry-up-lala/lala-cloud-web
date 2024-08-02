import { get, put } from '@/api/request/request';
import {
  USER_PERSONAL_URL,
  USER_PERSONAL_PASSWORD_URL,
} from '@/api/url/user-personal';

export interface UserPersonalResponseBody {
  id: string;
  loginName: string;
  realName: string;
  mail?: string;
  nickName?: string;
  intro?: string;
}

export interface UserPersonalSaveRequestBody {
  mail?: string;
  nickName?: string;
  intro?: string;
}

export interface UserPersonalPasswordRequestBody {
  oldPassWord: string;
  newPassWord: string;
}

export function userPersonalInfoApi() {
  return get<UserPersonalResponseBody>(USER_PERSONAL_URL);
}

export function userPersonalSaveApi(requestBody: UserPersonalSaveRequestBody) {
  return put(USER_PERSONAL_URL, requestBody);
}

export function userPersonalPasswordApi(
  requestBody: UserPersonalPasswordRequestBody
) {
  return put(USER_PERSONAL_PASSWORD_URL, requestBody);
}
