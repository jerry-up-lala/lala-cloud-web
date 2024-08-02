import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import useUser from '@/hooks/user';
import { getToken } from '@/utils/auth';
import i18n from '@/locale/index';
import { R } from '@/global/body';

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.url && !config.url.includes('/open/')) {
      const token = getToken();
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse<R>) => {
    const res = response.data;
    if (res.error) {
      const { t } = i18n.global;
      if (res.error.code === '100002' || res.error.code === '100003') {
        Modal.error({
          title: t('common.tip'),
          titleAlign: 'start',
          width: 320,
          draggable: true,
          footer: true,
          simple: false,
          content: t('common.interceptor.logout.content'),
          async onBeforeClose() {
            const { loginout } = useUser();
            await loginout(false);
          },
        });
        return res;
      }
      const apiErrorRMsg =
        res.error.msg || t('common.interceptor.request.error');
      Message.error({
        content: apiErrorRMsg,
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(JSON.stringify(res.error)));
    }
    if (response.config.responseType === 'blob') {
      const contentDisposition = response.headers['content-disposition'];
      const fileName = decodeURIComponent(
        contentDisposition.split(';')[1].split('=')[1]
      );
      return {
        fileName,
        file: res,
      };
    }
    return res;
  },
  (error) => {
    const { t } = i18n.global;
    const apiErrorRMsg = error.msg || t('common.interceptor.request.error');
    Message.error({
      content: apiErrorRMsg,
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
