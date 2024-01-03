import { METHOD } from 'global';
import { useSWRWrapper } from './swr';
import {
  CategoryQuestionRes,
  IBlog,
  PaymentMethodRes,
  PaymentPackageRes,
} from 'interfaces';

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

export const useCategoryQuestions = () => {
  return useSWRWrapper<{ items: CategoryQuestionRes[] }>(
    '/api/v1/questionCategories',
    {
      url: '/api/v1/questionCategories',
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 86400000, // 1 day
    },
  );
};

export const useBlog = (postId: string) => {
  return useSWRWrapper<IBlog>(`/api/v1/posts/${postId}`, {
    url: `/api/v1/posts/${postId}`,
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
};
