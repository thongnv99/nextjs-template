import { METHOD } from 'global';
import { useSWRWrapper } from './swr';

interface PaymentMethodRes {
  items: {
    id: number;
    name: string;
    params: {
      banks?: {
        accountName: string;
        accountNumber: string;
        bankCode: string;
        bankName: string;
      }[];
    };
  }[];
}

export const usePaymentMethod = () => {
  return useSWRWrapper<PaymentMethodRes>('/api/v1/paymentMethods', {
    url: '/api/v1/paymentMethods',
    revalidateOnFocus: false,
    revalidateOnMount: true,
    refreshInterval: 86400000, // 1 day
  });
};
