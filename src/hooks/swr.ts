import { METHOD } from 'global';
import { useSession } from 'next-auth/react';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import useSWR, { useSWRConfig } from 'swr';
import { isBlank } from 'utils/common';
import { fetcher, replacePlaceholder } from 'utils/restApi';
import { NotificationConfig, RestError } from 'interfaces';
import { PublicConfiguration } from 'swr/_internal';
import { COMMON_LOADING } from 'store/key';

export function useSWRWrapper<T = any>(
  key: string | null | (() => string | null),
  {
    url,
    ignoreKeyParse,
    method,
    body,
    auth,
    ...config
  }: {
    url?: string;
    method?: METHOD;
    body?: Record<string, unknown>;
    auth?: boolean;
    ignoreKeyParse?: boolean;
  } & Partial<PublicConfiguration<T, any, (arg: string) => any>>,
) {
  const { data: session } = useSession();
  let keyParse = typeof key === 'string' ? key : key?.();

  if (!ignoreKeyParse && !isBlank(keyParse!)) {
    if (body && (!method || method === METHOD.GET)) {
      keyParse =
        key + `?${new URLSearchParams(body as Record<string, string>)}`;
    }
    keyParse = replacePlaceholder(
      keyParse!,
      (body as unknown as Record<string, unknown>) || {},
    );
  }
  return useSWR<T>(
    isBlank(keyParse!) ? null : keyParse,
    (...rest) => {
      if (auth) {
        return fetcher(
          url ?? (typeof key === 'string' ? key : key?.()) ?? '',
          method ?? METHOD.GET,
          body,
          {
            Authorization: `Bearer ${session?.token}`,
          },
        );
      } else {
        return fetcher(
          url ?? (typeof key === 'string' ? key : key?.()) ?? '',
          method ?? METHOD.GET,
          body,
        );
      }
    },
    config,
  );
}

export const useMutation = <T = Record<string, unknown>>(
  key: string,
  {
    url,
    method,
    notification,
    ...options
  }: {
    url?: string;
    method?: METHOD;
    notification?: NotificationConfig;
    componentId?: string;
    loading?: boolean;
  } & SWRMutationConfiguration<T, RestError & Record<string, unknown>>,
) => {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  return useSWRMutation(
    key,
    (
      key: string,
      { arg: body }: { arg?: Record<string, unknown> | FormData },
    ) => {
      return new Promise((resolve, reject) => {
        if (options.loading) {
          mutate(COMMON_LOADING, {
            componentId: options.componentId,
            loading: true,
          });
        }
        fetcher(
          url ?? key,
          method ?? METHOD.POST,
          body as Record<string, unknown>,
          {
            Authorization: `Bearer ${session?.token}`,
          },
        )
          .then(data => resolve(data))
          .catch(err => reject(err))
          .finally(() => {
            {
              if (options.loading) {
                mutate(COMMON_LOADING, {
                  componentId: options.componentId,
                  loading: false,
                });
              }
            }
          });
      });
    },
    {
      onError(err, key, config) {
        console.log('error');
        options.onError?.(err, key, config as any);
        if (notification && !notification.ignoreError) {
          // toast(<ToastNotification type="error" content={err.message || err.code} />, {
          //   toastId: uuid(),
          //   position: "top-center",
          //   hideProgressBar: true,
          //   theme: "light",
          //   closeButton: false
          // })
        }
      },
      onSuccess(data, key, config) {
        console.log('success');

        options.onSuccess?.(data as T, key, config as any);
        if (notification && !notification.ignoreSuccess) {
          // toast(<ToastNotification type="success" content={notification.content} />, {
          //   toastId: uuid(),
          //   position: "top-center",
          //   hideProgressBar: true,
          //   theme: "light",
          //   closeButton: false
          // })
        }
      },
    },
  );
};
