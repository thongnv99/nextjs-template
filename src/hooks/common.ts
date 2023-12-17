import { METHOD } from 'global';
import { useSWRWrapper } from './swr';
import { PaymentMethodRes, PaymentPackageRes } from 'interfaces';

export const usePaymentMethod = () => {
  return useSWRWrapper<PaymentMethodRes>('/api/v1/paymentMethods', {
    url: '/api/v1/paymentMethods',
    revalidateOnFocus: false,
    revalidateOnMount: true,
    refreshInterval: 86400000, // 1 day
  });
};

export const usePaymentPackages = () => {
  return useSWRWrapper<{ items: PaymentPackageRes[] }>('/api/v1/packages', {
    url: '/api/v1/packages',
    revalidateOnFocus: false,
    revalidateOnMount: true,
    refreshInterval: 86400000, // 1 day
  });
};
