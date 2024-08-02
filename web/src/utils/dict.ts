import { useDictStore } from '@/store';
import { DICT_KEY } from '@/global/dict';
import { treeConvertExpanded } from '@/utils/array';
import { DictOptions } from '@/store/modules/dict/types';

const dictStore = useDictStore();

export const dictOptions = (dictKey?: DICT_KEY): DictOptions[] => {
  return dictStore.getDictOptions(dictKey) ?? [];
};

export const dictLabels = (dictKey?: DICT_KEY): string[] => {
  return dictOptions(dictKey).map((item) => item.label);
};

const dictParse = (dict: DictOptions) => {
  return {
    ...dict,
    value: dict.value ?? null,
  };
};

export const dictExpandedOptions = (dictKey: DICT_KEY): DictOptions[] => {
  return treeConvertExpanded(dictOptions(dictKey), dictParse);
};
