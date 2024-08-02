import { defineStore } from 'pinia';
import { dictItemAllApi } from '@/api/request/dict';
import { DictState, DictData, DictOptions } from './types';

const useDictStore = defineStore('dict', {
  state: (): DictState => {
    return {
      dictData: {},
      dictRequest: false,
    };
  },

  getters: {
    getDictData(): DictData {
      return this.dictData;
    },
    getDictRequest(): boolean {
      return this.dictRequest;
    },
  },

  actions: {
    async setDict() {
      const { data } = await dictItemAllApi();
      this.dictData = data;
      this.dictRequest = true;
    },
    getDictOptions(dictKey?: string): DictOptions[] {
      if (!dictKey) {
        return [];
      }
      if (this.dictRequest === false) {
        this.setDict();
      }
      return this.dictData[dictKey];
    },
  },
});

export default useDictStore;
