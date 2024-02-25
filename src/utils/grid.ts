import { ValueFormatterParams } from 'ag-grid-community';
import { formatNumber } from './common';
import { formatDateToString } from './datetime';

export const floatFormatter = (params: ValueFormatterParams) => {
  return formatNumber(params.value, 2, undefined, false, params.value ?? '');
};

export const integerFormatter = (params: ValueFormatterParams) => {
  return formatNumber(params.value, 0, undefined, false, params.value ?? '');
};

export const dateTimeFormatter = (params: ValueFormatterParams) => {
  return (
    formatDateToString(new Date(params.value), 'HH:mm:ss dd/MM/yyyy') ?? ''
  );
};
