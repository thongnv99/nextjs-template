import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { NotificationConfig } from 'interfaces';

export const useUpdateBlogMutation = ({
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
  }>('BLOG_UPDATE_BLOG', {
    url: '/api/v1/posts/{postId}',
    method: METHOD.PUT,
    loading: true,
    componentId,
    notification: notification ?? {
      title: 'Đăng bài viết',
      content: 'Đăng bài viết thành công',
    },
    onSuccess: data => {
      onSuccess();
    },
  });
};
