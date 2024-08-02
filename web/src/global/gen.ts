import { JTableColumn, JTableColumnSlotType } from '@/global/j';
import i18n from '@/locale/index';

export interface GenField {
  fieldName: string;
  i18n: string;
  slotType?: JTableColumnSlotType;
  width?: number;
}

export interface GenTable {
  index?: boolean;
  operate?: boolean;
}

export interface Gen {
  fields: GenField[];
  table?: GenTable;
}

export const loadJTableColumns = (gen: Gen): JTableColumn[] => {
  const { t } = i18n.global;
  const columns: JTableColumn[] = [];
  if (gen.table?.index !== false) {
    columns.push({
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      slotType: '#',
      width: 65,
      ellipsis: true,
      tooltip: true,
    });
  }

  gen.fields.forEach((field: GenField) => {
    const column: JTableColumn = {
      title: t(field.i18n),
      dataIndex: field.fieldName,
      width: field.width,
      ellipsis: true,
      tooltip: true,
    };
    if (field.slotType) {
      column.slotName = field.fieldName;
      column.slotType = field.slotType;
    }
    columns.push(column);
  });

  if (gen.table?.operate !== false) {
    columns.push({
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 160,
      fixed: 'right',
    });
  }
  return columns;
};
