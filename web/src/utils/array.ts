import cloneDeep from 'lodash/cloneDeep';
import i18n from '@/locale/index';

export const arrayConcat = <T>(arr1?: Array<T>, arr2?: Array<T>): Array<T> => {
  return (arr1 || []).concat(arr2 || []).filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

export const arrayContains = <T>(arr: Array<T>, val: T): boolean => {
  return arr.some((item) => item === val);
};

export const arrayRandom = <T>(
  array: T[],
  minCount: number,
  maxCount: number
): T[] => {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const result: T[] = [];

  for (let i = 0; i < count; i += 1) {
    const randomIndex = Math.floor(Math.random() * array.length);
    result.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }

  return result;
};

export const treeExpanded = (
  arrayData: any[],
  childKey = 'children'
): any[] => {
  const arr: any[] = [];
  const expanded = (datas: any[]) => {
    if (datas && datas.length > 0) {
      datas.forEach((data) => {
        arr.push(data);
        expanded(data[childKey]);
      });
    }
  };
  expanded(arrayData);
  return arr;
};

export const treeArrayFind = (
  arrayData: any[],
  value: any,
  valueKey = 'value',
  childKey = 'children'
): any => {
  const array: any[] = treeExpanded(arrayData, childKey);
  return array.find(
    (item) => item && item[valueKey] && item[valueKey] === value
  );
};

export const treeArraySearch = (
  arrayData: any[],
  searchValue: any,
  valueKey = 'key'
): any => {
  const loop = (data: any[]) => {
    const result: any[] = [];
    data.forEach((item) => {
      if (
        item[valueKey].toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      ) {
        result.push({ ...item });
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          });
        }
      }
    });
    return result;
  };

  return loop(arrayData);
};

export const arrayActionInfo = (info: string, array: Array<any>): string => {
  const { t } = i18n.global;
  return `${info}${
    array.length > 0 ? `${array.length}${t('common.action.item')}` : ''
  }`;
};

export const arrayExchange = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    newArray.splice(
      beforeIdx,
      1,
      newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
};

export const nodeConvert = (
  node: any,
  fn: (value: any) => any,
  childKey = 'children'
): Array<any> => {
  node = fn(node);
  if (node[childKey]) {
    node[childKey] = node[childKey].map((item: any) => nodeConvert(item, fn));
  }
  return node;
};

export const arrayConvert = (
  array: Array<any>,
  fn: (value: any) => any,
  childKey = 'children'
): Array<any> => {
  return array?.map((item) => nodeConvert(item, fn, childKey));
};

export const treeConvertExpanded = (
  arrayData: any[],
  fn: (value: any) => any,
  childKey = 'children'
): any[] => {
  const arr: any[] = [];
  const expanded = (datas: any[]) => {
    if (datas && datas.length > 0) {
      datas.forEach((data) => {
        arr.push(fn(data));
        expanded(data[childKey]);
      });
    }
  };
  expanded(arrayData);
  return arr;
};
