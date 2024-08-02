import type { SelectFieldNames } from '@arco-design/web-vue/es/select/interface';
import type { TreeFieldNames } from '@arco-design/web-vue/es/tree/interface';
import type { CascaderFieldNames } from '@arco-design/web-vue/es/cascader/interface';

// eslint-disable-next-line no-shadow
export enum DICT_KEY {
  STATE = 'STATE',
  CRUD_LIST = 'CRUD_LIST',
  CRUD_TREE = 'CRUD_TREE',
}

export const DICT_KEY_SELECT_FIELD_NAMES: SelectFieldNames = {
  value: 'dictKey',
  label: 'dictName',
};

export const DICT_TREE_FIELD_NAMES: TreeFieldNames = {
  key: 'values',
  title: 'label',
  children: 'children',
};

export const DICT_CASCADER_FIELD_NAMES: CascaderFieldNames = {
  value: 'values',
  label: 'label',
  children: 'children',
};
