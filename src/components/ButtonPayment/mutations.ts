import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';

export const usePaymentCodeMutation = (componentId?: string) => {
  return useMutation<{ paymentCode: string; id: string }>('GET_PAYMENT_CODE', {
    url: '/api/v1/paymentHistories',
    method: METHOD.POST,
    loading: true,
    componentId,
  });
};

export const usePaymentPaidMutation = (
  componentId?: string,
  onSuccess?: () => void,
) => {
  return useMutation('CONFIRM_PAID', {
    url: `/api/v1/paymentHistories/{id}/confirmPaid`,
    method: METHOD.POST,
    loading: true,
    componentId,
    notification: {
      title: 'Xác nhận thanh toán',
      content: 'Xác nhận thanh toán thành công',
    },
    onSuccess,
  });
};
