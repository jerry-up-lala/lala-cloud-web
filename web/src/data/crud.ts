import { computed } from 'vue';
import { DICT_KEY } from '@/global/dict';
import { dictLabels, dictOptions, dictExpandedOptions } from '@/utils/dict';

export const crudOptionsData = (t: any) => [
  t('basic.crud.options.code'),
  t('basic.crud.options.football'),
  t('basic.crud.options.f1'),
];

export const crudListOptionsData = (t: any) => [
  {
    label: t('basic.crud.options.code'),
    value: 1,
    children: [
      {
        label: t('basic.crud.options.code.java'),
        value: 4,
      },
      {
        label: t('basic.crud.options.code.go'),
        value: 5,
      },
      {
        label: t('basic.crud.options.code.node'),
        value: 6,
      },
    ],
  },
  {
    label: t('basic.crud.options.football'),
    value: 2,
    children: [
      {
        label: t('basic.crud.options.football.rma'),
        value: 7,
      },
      {
        label: t('basic.crud.options.football.man-utd'),
        value: 8,
      },
      {
        label: t('basic.crud.options.football.sporting'),
        value: 9,
      },
    ],
  },
  {
    label: t('basic.crud.options.f1'),
    value: 3,
    children: [
      {
        label: t('basic.crud.options.f1.aston-martin'),
        value: 10,
      },
      {
        label: t('basic.crud.options.f1.red-bull'),
        value: 11,
      },
      {
        label: t('basic.crud.options.f1.mercedes-amg'),
        value: 12,
      },
    ],
  },
];

export const crudTransferOptionsData = (t: any) => [
  {
    label: t('basic.crud.options.code'),
    value: '1',
    disabled: false,
  },
  {
    label: t('basic.crud.options.football'),
    value: '2',
    disabled: false,
  },
  {
    label: t('basic.crud.options.f1'),
    value: '3',
    disabled: false,
  },
];

export const crudTreeOptionsData = (t: any) => [
  {
    title: t('basic.crud.options.code'),
    key: 1,
    children: [
      {
        title: t('basic.crud.options.code.java'),
        key: 4,
      },
      {
        title: t('basic.crud.options.code.go'),
        key: 5,
      },
      {
        title: t('basic.crud.options.code.node'),
        key: 6,
      },
    ],
  },
  {
    title: t('basic.crud.options.football'),
    key: 2,
    children: [
      {
        title: t('basic.crud.options.football.rma'),
        key: 7,
      },
      {
        title: t('basic.crud.options.football.man-utd'),
        key: 8,
      },
      {
        title: t('basic.crud.options.football.sporting'),
        key: 9,
      },
    ],
  },
  {
    title: t('basic.crud.options.f1'),
    key: 3,
    children: [
      {
        title: t('basic.crud.options.f1.aston-martin'),
        key: 10,
      },
      {
        title: t('basic.crud.options.f1.red-bull'),
        key: 11,
      },
      {
        title: t('basic.crud.options.f1.mercedes-amg'),
        key: 12,
      },
    ],
  },
];

export function crudOptions() {
  const crudListLabelsOptions = computed(() => dictLabels(DICT_KEY.CRUD_LIST));

  const crudSwitchInfoOptions = computed<any[]>(() =>
    dictOptions(DICT_KEY.STATE)
  );

  const crudListOptions = computed<any[]>(() =>
    dictOptions(DICT_KEY.CRUD_LIST)
  );

  const crudTreeOptions = computed<any[]>(() =>
    dictOptions(DICT_KEY.CRUD_TREE)
  );

  const crudTreeExpandedOptions = computed<any[]>(() =>
    dictExpandedOptions(DICT_KEY.CRUD_TREE)
  );

  return {
    crudListLabelsOptions,
    crudSwitchInfoOptions,
    crudListOptions,
    crudTreeOptions,
    crudTreeExpandedOptions,
  };
}
