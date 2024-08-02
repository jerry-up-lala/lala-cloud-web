export const dataTypeOptionsData = () => [
  {
    value: 'STRING',
    label: 'STRING',
    tagProps: { color: '#b71de8' },
  },
  {
    value: 'LIST',
    label: 'LIST',
    tagProps: { color: '#00b42a' },
  },
  {
    value: 'SET',
    label: 'SET',
    tagProps: { color: '#ffb400' },
  },
  {
    value: 'ZSET',
    label: 'ZSET',
    tagProps: { color: '#eb0aa4' },
  },
  {
    value: 'HASH',
    label: 'HASH',
    tagProps: { color: '#165dff' },
  },
];

export const listPushTypeOptionsData = (t: any) => [
  {
    value: 1,
    label: t('ware.redis.list.pushType.tail'),
  },
  {
    value: 2,
    label: t('ware.redis.list.pushType.head'),
  },
];

export default {};
