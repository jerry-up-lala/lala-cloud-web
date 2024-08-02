export interface DictOptions {
  value: string | null;
  label: string;
  labels: string;
  values: string;
  children: DictOptions[] | null;
}

export interface DictData {
  [name: string]: DictOptions[];
}

export interface DictState {
  dictData: DictData;
  dictRequest: boolean;
}
