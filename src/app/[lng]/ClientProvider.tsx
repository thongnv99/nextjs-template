'use client';
import { useTranslation } from 'app/i18n/client';
import Preload from 'components/Preload';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { TRIGGER_SESSION_TIMEOUT } from 'store/key';
import { SWRConfig, mutate } from 'swr';
import { setYupLocale } from 'utils/validator';

type Props = {
  children?: React.ReactNode;
  lng?: string;
};

export const ClientProvider = ({ children, lng }: Props) => {
  const { data, status } = useSession();
  const { i18n } = useTranslation();

  useEffect(() => {
    setYupLocale(i18n.t);
  }, [lng, i18n]);
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        onError(err, key, config) {
          if (err.message === 'TOKEN_INVALID') {
            mutate(TRIGGER_SESSION_TIMEOUT, {});
          }
        },
      }}
    >
      {status === 'loading' ? <Preload /> : children}
    </SWRConfig>
  );
};
