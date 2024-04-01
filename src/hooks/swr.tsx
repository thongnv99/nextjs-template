import { METHOD } from 'global';
import { useSession } from 'next-auth/react';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import useSWR, { useSWRConfig } from 'swr';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
import { isBlank, uuid } from 'utils/common';
import { fetcher, replacePlaceholder } from 'utils/restApi';
import { NotificationConfig, RestError, RestResponse } from 'interfaces';
import { FetcherResponse, PublicConfiguration } from 'swr/_internal';
import { COMMON_LOADING, TRIGGER_SESSION_TIMEOUT } from 'store/key';
import { toast } from 'react-toastify';
import ToastNotification from 'components/ToastNotification';

export function useSWRWrapper<T = Record<string, unknown>>(
  key: string | null | (() => string | null),
  {
    url,
    ignoreKeyParse,
    method,
    params,
    auth,
    ...config
  }: {
    url?: string;
    method?: METHOD;
    params?: Record<string, unknown>;
    auth?: boolean;
    ignoreKeyParse?: boolean;
  } & Partial<PublicConfiguration<T, RestError, (arg: string) => any>>,
) {
  const { data: session } = useSession();
  let keyParse = typeof key === 'string' ? key : key?.();

  return useSWR<T>(
    isBlank(keyParse!) ? null : (keyParse as any),
    () => {
      return new Promise((resolve, reject) => {
        fetcher<T>(
          url ?? (typeof key === 'string' ? key : key?.()) ?? '',
          method ?? METHOD.GET,
          params,
          {
            Authorization: `Bearer ${session?.token}`,
          },
        )
          .then(data => {
            if (data.status) {
              resolve(data.result!);
            } else {
              reject(data);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    config,
  );
}

export const useMutation = <T = Record<string, unknown>,>(
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
      return new Promise<T | undefined>((resolve, reject) => {
        if (options.loading) {
          mutate(COMMON_LOADING, {
            componentId: options.componentId,
            loading: true,
          });
        }
        fetcher<T>(
          url ?? key,
          method ?? METHOD.POST,
          body as Record<string, unknown>,
          {
            Authorization: `Bearer ${session?.token}`,
          },
        )
          .then(data => resolve(data.result))
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
        console.log({ err });
        if (err.message === 'TOKEN_INVALID') {
          mutate(TRIGGER_SESSION_TIMEOUT, {});
        }
        options.onError?.(err, key, config as any);
        if (notification && !notification.ignoreError) {
          toast(
            <ToastNotification
              type="error"
              title={notification.title}
              content={err.message || err.code}
            />,
            {
              toastId: uuid(),
              position: 'top-right',
              hideProgressBar: true,
              theme: 'light',
            },
          );
        }
      },
      onSuccess(data, key, config) {
        options.onSuccess?.(data!, key, config as any);
        if (notification && !notification.ignoreSuccess) {
          toast(
            <ToastNotification
              type="success"
              title={notification.title}
              content={notification.content}
            />,
            {
              toastId: uuid(),
              position: 'top-right',
              hideProgressBar: true,
              theme: 'light',
            },
          );
        }
      },
    },
  );
};

export function useSWRInfiniteWrapper<T = Record<string, unknown>>(
  key: string | null | (() => string | null),
  {
    url,
    method,
    params,
    ...options
  }: {
    url?: string;
    method?: METHOD;
    params?: Record<string, unknown>;
    auth?: boolean;
    ignoreKeyParse?: boolean;
  } & Partial<SWRInfiniteConfiguration<T, RestError>>,
) {
  const { data: session } = useSession();
  let keyParse = typeof key === 'string' ? key : key?.();

  return useSWRInfinite<T>(
    isBlank(keyParse!) ? null : (keyParse as any),
    () => {
      return new Promise((resolve, reject) => {
        fetcher<T>(
          url ?? (typeof key === 'string' ? key : key?.()) ?? '',
          method ?? METHOD.GET,
          params,
          {
            Authorization: `Bearer ${session?.token}`,
          },
        )
          .then(data => {
            if (data.status) {
              resolve(data.result!);
            } else {
              reject(data);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    options,
  );
}
