import type { TableColumn } from '@/global/table';

export type JBatchType = 'DELETE' | 'EXPORT';

export interface JBatchButtonType {
  type?: JBatchType;
  permission?: string[];
  api?: (param: any) => Promise<any>;
  okApi?: () => Promise<any>;
}

export interface JBatchButtonProps extends JBatchButtonType {
  show: boolean;
}

export type JButtonType = 'ADD' | 'UPDATE' | 'UPLOAD';

export interface JButtonInfo {
  text: string;
  icon: string;
  type: 'dashed' | 'text' | 'outline' | 'primary' | 'secondary';
}

export type JFormItemType =
  | 'input'
  | 'inputNumber'
  | 'inputTag'
  | 'autoComplete'
  | 'textArea'
  | 'rate'
  | 'slider'
  | 'switch'
  | 'radioGroup'
  | 'checkboxGroup'
  | 'mention'
  | 'select'
  | 'cascader'
  | 'treeSelect'
  | 'transfer'
  | 'rangePicker'
  | 'datePicker';

export interface JSaveFormField {
  field: string;
  label: string;
  type: JFormItemType;
  input?: {
    maxLength?: number;
  };
  textarea?: {
    maxLength?: number;
  };
  inputNumber?: {
    precision?: number;
    min?: number;
    max?: number;
  };
  options?: {
    data: any[];
    multiple?: boolean;
    parent?: boolean;
    maxTagCount?: number;
    fieldNames?: any;
  };
  datePicker?: {
    format?: string;
  };
}

export interface JQueryFormField {
  field: string;
  label: string;
  type: JFormItemType;
  inputNumber?: {
    precision?: number;
    min?: number;
    max?: number;
  };
  options?: {
    data: any[];
    multiple?: boolean;
    parent?: boolean;
    maxTagCount?: number;
    fieldNames?: any;
  };
  rangePicker?: {
    format?: string;
  };
}

export type JTableColumnSlotType = 'tag' | '#';

export interface JTableColumn extends TableColumn {
  valueField?: string;
  labelField?: string;
  slotType?: JTableColumnSlotType;
  options?: {
    data: any[];
  };
}

export interface JOption {
  [name: string]: any[];
}
