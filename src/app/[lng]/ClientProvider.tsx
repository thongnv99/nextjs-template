'use client';

import { useTranslation } from 'app/i18n/client';
import Preload from 'components/Preload';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
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
  return status === 'loading' ? <Preload /> : children;
};
