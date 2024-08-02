import i18n from '@/locale/index';
import type {
  TableColumnData,
  TableRowSelection,
  TableSortable,
} from '@arco-design/web-vue/es/table/interface';
import { PaginationProps } from '@arco-design/web-vue/es/pagination';

export interface TableColumn extends TableColumnData {
  checked?: boolean;
}

export const PaginationDefault: PaginationProps = {
  current: 1,
  pageSize: 20,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [20, 50, 100, 200],
};

export const TableRowSelectionDefault: TableRowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
};

export type TableSize = 'mini' | 'small' | 'medium' | 'large';

export interface TableSizeType {
  name: string;
  value: TableSize;
}

export const tableSizeTypes = (): TableSizeType[] => {
  const { t } = i18n.global;
  return [
    {
      name: t('common.table.size.mini'),
      value: 'mini',
    },
    {
      name: t('common.table.size.small'),
      value: 'small',
    },
    {
      name: t('common.table.size.medium'),
      value: 'medium',
    },
    {
      name: t('common.table.size.large'),
      value: 'large',
    },
  ];
};

export const tableSortField = (field: string): TableSortable => {
  return {
    sortDirections: ['ascend', 'descend'],
    sorter: (a, b, extra) => {
      if (extra.direction === 'ascend') {
        return (a[field] ? a[field] : 0) - (b[field] ? b[field] : 0);
      }
      if (extra.direction === 'descend') {
        return (b[field] ? b[field] : 0) - (a[field] ? a[field] : 0);
      }
      return 0;
    },
  };
};
