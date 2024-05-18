import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { NotificationConfig } from 'interfaces';
import { useTranslation } from 'app/i18n/client';
const { t } = useTranslation();

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
      title: 'J_231',
      content: 'J_232',
    },
    onSuccess: data => {
      onSuccess();
    },
  });
};

export const useUpdateQuestionMutation = ({
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
  }>('QUESTION_UPDATE_QUESTION', {
    url: '/api/v1/questions/{questionId}',
    method: METHOD.PUT,
    loading: true,
    componentId,
    notification: notification ?? {
      title: 'J_218',
      content: 'J_233',
    },
    onSuccess: data => {
      onSuccess();
    },
  });
};
