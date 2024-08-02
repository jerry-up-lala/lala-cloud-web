import { get, post } from '@/api/request/request';
import { USER_SETTING_URL } from '@/api/url/user-setting';
import { AppUserSettingState } from '@/store/modules/app/types';

export function userSettingInfoApi() {
  return get<AppUserSettingState>(USER_SETTING_URL);
}

export function userSettingSaveApi(requestBody: AppUserSettingState) {
  return post(USER_SETTING_URL, requestBody);
}
