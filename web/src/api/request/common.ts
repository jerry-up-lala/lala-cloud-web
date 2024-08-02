import { get } from '@/api/request/request';
import { COMMON_SNOW_ID_URL } from '@/api/url/common';

export function snowIdApi() {
  return get<string>(COMMON_SNOW_ID_URL);
}

export default {};
