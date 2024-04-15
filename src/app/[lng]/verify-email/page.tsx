'use client';
import React, { useEffect, useRef, useState } from 'react';
import { METHOD, ROUTES } from 'global';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Loader from 'components/Loader';
import { useMutation } from 'hooks/swr';
import { uuid } from 'utils/common';
import ModalProvider from 'components/ModalProvider';
import NoticeModal from 'components/NoticeModal';

const ResetPassword = () => {
  const { lng } = useParams();
  const search = useSearchParams();

  const componentId = useRef(uuid());
  const loading = useRef(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const { trigger: requestRegister } = useMutation(
    '/api/v1/users/confirmVerifyEmail',
    {
      method: METHOD.POST,
      url: '/api/v1/users/confirmVerifyEmail',
      loading: true,
      componentId: componentId.current,
      onSuccess() {
        handleShowSuccess();
      },
      onError(error) {
        setErrorMessage(error.message);
      },
    },
  );

  useEffect(() => {
    handleRegister();
  }, []);

  const handleRegister = () => {
    loading.current = !loading.current;
    setErrorMessage(null);
    const code = search.get('code');
    const userId = search.get('userId');
    requestRegister({ code, userId });
  };

  const handleShowSuccess = () => {
    setSuccessModal(true);
  };

  const handleHiddenSuccess = () => {
    setSuccessModal(false);
    router.push(`/${lng}/${ROUTES.LOGIN}`);
  };

  return (
    <Loader
      id={componentId.current}
      className="w-full h-full flex items-center justify-center p-8 overflow-y-auto bg-primary-50"
    >
      <ModalProvider show={successModal} onClose={handleHiddenSuccess}>
        <NoticeModal
          onConfirm={handleHiddenSuccess}
          title="Xác thực thành công"
          content="Email được xác thực thành công."
          type="success"
        />
      </ModalProvider>
    </Loader>
  );
};

export default ResetPassword;
