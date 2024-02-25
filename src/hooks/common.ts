import { METHOD } from 'global';
import { useSWRWrapper } from './swr';
import {
  CategoryQuestionRes,
  FlashCardRes,
  IBlog,
  PaymentMethodRes,
  PaymentPackageRes,
  IContest,
} from 'interfaces';
import { isBlank } from 'utils/common';
import { User } from 'next-auth';
import { ACCOUNT_PROFILE_INFO } from 'store/key';

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

export const useFlashCard = (status: string) => {
  return useSWRWrapper<FlashCardRes>(`/api/v1/flashcards?status=${status}`, {
    url: '/api/v1/flashcards',
    method: METHOD.GET,
    params: {
      ...(!isBlank(status) && {
        status,
      }),
    },
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
};

//lấy danh sách cuộc thi hiện tại
export const useCompetition = () => {
  return useSWRWrapper<IContest>(`api/v1/contests`, {
    url: '/api/v1/contests',
    method: METHOD.GET,
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
};

export const useUserInfo = () => {
  return useSWRWrapper<{ user: User }>(ACCOUNT_PROFILE_INFO, {
    url: '/api/v1/verifyAccessToken',
    method: METHOD.POST,
    revalidateOnFocus: false,
    auth: true,
  });
};
