'use client';
import ModalProvider from 'components/ModalProvider';
import NoticeModal from 'components/NoticeModal';
import { ROUTES } from 'global';
import { signOut, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TRIGGER_SESSION_TIMEOUT } from 'store/key';
import useSWR, { mutate } from 'swr';
import { useTranslation } from 'app/i18n/client';

const SessionTimeout = () => {
  const { t } = useTranslation();
  const { data: triggerTimeout } = useSWR(TRIGGER_SESSION_TIMEOUT, null, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });
  const { data } = useSession();
  const router = useRouter();
  const { lng } = useParams();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (
      data &&
      data.expires &&
      new Date(data.expires).getTime() < new Date().getTime()
    ) {
      setShow(true);
    }
  }, [data]);

  useEffect(() => {
    if (triggerTimeout) {
      setShow(true);
    }
  }, [triggerTimeout]);

  const handleConfirm = () => {
    setShow(false);
    mutate(TRIGGER_SESSION_TIMEOUT, null);
    signOut({
      redirect: true,
      callbackUrl: `${window.origin}/${lng}/login`,
    });
  };

  return (
    <ModalProvider show={show} onClose={handleConfirm}>
      <NoticeModal
        type={'error'}
        title="Session timeout"
        onConfirm={handleConfirm}
        content="J_239"
      />
    </ModalProvider>
  );
};

export default SessionTimeout;
