export const workQueueTypeList = (t: any) => [
  {
    label: t('basic.concurrent.workQueueType.linkedBlockingQueue'),
    value: 1,
    disabled: false,
    sizeRequired: true,
  },
  {
    label: t('basic.concurrent.workQueueType.arrayBlockingQueue'),
    value: 2,
    disabled: false,
    sizeRequired: true,
  },
  {
    label: t('basic.concurrent.workQueueType.linkedBlockingDeque'),
    value: 3,
    disabled: false,
    sizeRequired: true,
  },
  {
    label: t('basic.concurrent.workQueueType.priorityBlockingQueue'),
    value: 4,
    disabled: false,
    sizeRequired: true,
  },
  {
    label: t('basic.concurrent.workQueueType.linkedTransferQueue'),
    value: 5,
    disabled: false,
    sizeRequired: false,
  },
  {
    label: t('basic.concurrent.workQueueType.synchronousQueue'),
    value: 6,
    disabled: false,
    sizeRequired: false,
  },
];

export const rejectedExecutionTypeList = (t: any) => [
  {
    label: t('basic.concurrent.rejectedExecutionType.abortPolicy'),
    value: 1,
    disabled: false,
  },
  {
    label: t('basic.concurrent.rejectedExecutionType.callerRunsPolicy'),
    value: 2,
    disabled: false,
  },
  {
    label: t('basic.concurrent.rejectedExecutionType.discardOldestPolicy'),
    value: 3,
    disabled: false,
  },
  {
    label: t('basic.concurrent.rejectedExecutionType.discardPolicy'),
    value: 4,
    disabled: false,
  },
];
