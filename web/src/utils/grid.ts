import { ResponsiveValue } from '@arco-design/web-vue/es/grid';

export interface FormColProps {
  labelColProps: ResponsiveValue;
  wrapperColProps: ResponsiveValue;
}

function labelColSpan(length: number, grid?: boolean): number {
  const span = grid ? [2, 3, 3, 4, 5, 6, 7, 8] : [2, 5, 6, 8, 9, 10, 11, 13];
  return span[length - 1];
}

export const formColProps = (label: string, grid?: boolean): FormColProps => {
  const labelCol = labelColSpan(label.length, grid);
  const wrapperCol = 24 - labelCol;
  return {
    labelColProps: {
      xxl: labelCol,
      xl: labelCol,
      lg: labelCol,
      md: labelCol,
      sm: labelCol,
      xs: labelCol,
    },
    wrapperColProps: {
      xxl: wrapperCol,
      xl: wrapperCol,
      lg: wrapperCol,
      md: wrapperCol,
      sm: wrapperCol,
      xs: wrapperCol,
    },
  };
};
