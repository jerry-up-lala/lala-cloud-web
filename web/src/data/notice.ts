export const noticeTypeOptionsData = (t: any) => [
  {
    value: 1,
    label: t('system.notice.type.info'),
    color: 'blue',
  },
  {
    value: 2,
    label: t('system.notice.type.notice'),
    color: 'orange',
  },
];

export const sendStateOptionsData = (t: any) => [
  {
    value: 0,
    label: t('system.notice.sendState.unsent'),
    color: 'gray',
  },
  {
    value: 1,
    label: t('system.notice.sendState.sent'),
    color: 'blue',
  },
];
