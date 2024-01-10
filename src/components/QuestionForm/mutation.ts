import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { NotificationConfig } from 'interfaces';

export const useCreateQuestionMutation = ({
  onSuccess,
  componentId,
  notification,
}: {
  onSuccess: () => void;
  componentId?: string;
  notification?: NotificationConfig;
}) => {
  return useMutation<{
    items: Record<string, unknown>[];
  }>('QUESTION_ADD_QUESTION', {
    url: '/api/v1/questions',
    method: METHOD.POST,
    loading: true,
    componentId,
    notification: notification ?? {
      title: 'Tạo câu hỏi',
      content: 'Tạo câu hỏi thành công',
    },
    onSuccess: data => {
      onSuccess();
    },
  });
};
