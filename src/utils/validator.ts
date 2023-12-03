'use client';
import { TFunction } from 'i18next';
import * as yup from 'yup';
import { formatNumber } from './common';

export const setYupLocale = (t: TFunction) => {
  console.log('setYupLocale');
  yup.setLocale({
    mixed: {
      required: ({ label }: { label: string }) => t('N_1', { field: t(label) }),
    },
    number: {
      min: ({ label, min }: { label: string; min: number }) =>
        t('N_2', { field: t(label), value: formatNumber(min, 2) }),
      max: ({ label, max }: { label: string; max: number }) =>
        t('N_3', { field: t(label), value: formatNumber(max, 2) }),
      moreThan: ({ label, more }: { label: string; more: number }) =>
        t('N_4', { field: t(label), value: formatNumber(more, 2) }),
      lessThan: ({ label, less }: { label: string; less: number }) =>
        t('N_5', { field: t(label), value: formatNumber(less, 2) }),
    },
  });
};
