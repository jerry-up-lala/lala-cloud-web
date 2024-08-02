import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { i18nChangeLanguage } from '@wangeditor/editor';

export default function useLocale() {
  const i18 = useI18n();
  const currentLocale = computed(() => {
    return i18.locale.value;
  });
  const changeLocale = (value: any) => {
    if (i18.locale.value === value) {
      return;
    }
    i18.locale.value = value;
    localStorage.setItem('arco-locale', value);
    i18nChangeLanguage(value);
    Message.success(i18.t('common.action.locale'));
  };
  return {
    currentLocale,
    changeLocale,
  };
}
