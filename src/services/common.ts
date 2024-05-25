import { METHOD } from 'global';
import { IBlog, PaymentPackageRes, RestError, RestResponse } from 'interfaces';
import { fetcher } from 'utils/restApi';

export const getPaymentPackages = async () => {
  try {
    const res = await fetcher<{ items: PaymentPackageRes[] }>(
      '/api/v1/packages',
      METHOD.GET,
    );
    return res.result?.items ?? [];
  } catch (error) {
    return [];
  }
};

export const getPaymentMethods = async () => {
  try {
    const res = await fetcher<{ items: PaymentPackageRes[] }>(
      '/api/v1/paymentMethods',
      METHOD.GET,
    );
    return res.result?.items ?? [];
  } catch (error) {
    return [];
  }
};

export const getBlogs = async () => {
  try {
    const res = await fetcher<{ items: IBlog[] }>('/api/v1/posts', METHOD.GET);
    return res.result?.items ?? [];
  } catch (error) {
    return [];
  }
};

export const getBlogDetail = async (
  id: string,
): Promise<RestResponse<IBlog | undefined>> => {
  try {
    const res = await fetcher<IBlog>(`/api/v1/posts/${id}`, METHOD.GET);
    return res;
  } catch (error) {
    return error as RestError;
  }
};
