export const userReadStateOptionsData = (t: any) => [
  {
    value: 0,
    label: t('system.notice.user.readState.unsent'),
    color: 'gray',
  },
  {
    value: 1,
    label: t('system.notice.user.readState.unread'),
    color: 'red',
  },
  {
    value: 2,
    label: t('system.notice.user.readState.read'),
    color: 'blue',
  },
];

export default {};
