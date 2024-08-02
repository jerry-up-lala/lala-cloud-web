import i18n from '@/locale/index';
import { Message } from '@arco-design/web-vue';

export const copyAction = (data: string) => {
  const { t } = i18n.global;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data).catch(() => {
        Message.error(t('common.error.copy'));
      });
      Message.success(t('common.success.copy'));
      return;
    }
    let success = false;
    try {
      const inputElement = document.createElement('input');
      inputElement.value = data;
      document.body.appendChild(inputElement);
      inputElement.select();
      success = document.execCommand('copy');
      inputElement.remove();
    } catch (err) {
      // eslint-disable-next-line
    }
    if (success) {
      Message.success(t('common.success.copy'));
    } else {
      Message.error(t('common.error.copy'));
    }
  } catch (err) {
    // catch error
  }
};

export default {};
