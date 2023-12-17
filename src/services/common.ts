import { METHOD } from 'global';
import { PaymentPackageRes } from 'interfaces';
import { fetcher } from 'utils/restApi';

export const getPaymentPackages = async () => {
  const res = await fetcher<{ items: PaymentPackageRes[] }>(
    '/api/v1/packages',
    METHOD.GET,
  );
  return res.result?.items ?? [];
};

export const getPaymentMethods = async () => {
  const res = await fetcher<{ items: PaymentPackageRes[] }>(
    '/api/v1/paymentMethods',
    METHOD.GET,
  );
  return res.result?.items ?? [];
};
