import i18n from '@/locale/index';

export const stateOptionsData = () => {
  const { t } = i18n.global;
  return [
    {
      label: t('common.enum.effective'),
      value: 'true',
      color: 'blue',
    },
    {
      label: t('common.enum.invalid'),
      value: 'false',
      color: 'gray',
    },
  ];
};

export const booleanOptionsData = () => {
  const { t } = i18n.global;
  return [
    {
      label: t('common.enum.yes'),
      value: 'true',
    },
    {
      label: t('common.enum.no'),
      value: 'false',
    },
  ];
};

export const operateOptionsData = () => {
  const { t } = i18n.global;
  return [
    {
      label: t('common.enum.success'),
      value: 'true',
    },
    {
      label: t('common.enum.error'),
      value: 'false',
    },
  ];
};
