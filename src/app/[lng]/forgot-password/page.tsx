'use client';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import * as yup from 'yup';
import Mail from 'assets/svg/mail.svg';
import Lock from 'assets/svg/lock.svg';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { GENDER, METHOD, ROUTES } from 'global';
import { useParams, useRouter } from 'next/navigation';
import RadioGroup from 'elements/RadioGroup';
import Loader from 'components/Loader';
import { useMutation } from 'hooks/swr';
import { ACCOUNT_REGISTER, ACCOUNT_REQUEST_RESET_PASSWORD } from 'store/key';
import { isBlank, uuid } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import { useSWRConfig } from 'swr';
import ModalProvider from 'components/ModalProvider';
import NoticeModal from 'components/NoticeModal';

interface ForgotForm {
  email?: string;
}

const schema = yup.object().shape({
  email: yup.string().label('Email').required().email(),
});

const ForgotPassword = () => {
  const { lng } = useParams();
  const componentId = useRef(uuid());
  const loading = useRef(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const { trigger: requestRegister } = useMutation(
    ACCOUNT_REQUEST_RESET_PASSWORD,
    {
      method: METHOD.POST,
      url: '/api/v1/users/requestResetPassword',
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

  const handleForgot = (values: ForgotForm) => {
    loading.current = !loading.current;
    setErrorMessage(null);

    requestRegister({ email: values.email });
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
      <div className=" flex-1 px-[3.2rem] max-w-[50rem] shadow-sm rounded-lg bg-white border-gray-400 p-7">
        <div className="mb-[4.8rem] text-[4.8rem] text-center">
          Quên mật khẩu
        </div>
        {!isBlank(errorMessage!) && (
          <div className="mb-[4.8rem] text-[1.6rem] text-center text-red-600">
            {errorMessage}
          </div>
        )}
        <Formik
          onSubmit={handleForgot}
          validationSchema={schema}
          initialValues={{}}
          validateOnChange
          validateOnBlur
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
            isValid,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[3.2rem]"
              autoComplete="off"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[3.2rem]">
                <TextInput
                  label="Email"
                  name="email"
                  className="col-span-2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  autoComplete="off"
                  leadingIcon={<Mail />}
                  hasError={touched.email && !isBlank(errors.email)}
                  errorMessage={errors.email}
                />
              </div>
              <button
                disabled={!isValid}
                type="submit"
                className="btn-primary "
              >
                Xác nhận
              </button>

              <div className="text-center">
                Quay lại màn{' '}
                <Link
                  href={`/${lng}/${ROUTES.LOGIN}`}
                  className="text-[1.6rem] text-[var(--color-1)] cursor-pointer"
                >
                  đăng nhập?
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <ModalProvider show={successModal} onClose={handleHiddenSuccess}>
        <NoticeModal
          onConfirm={handleHiddenSuccess}
          title="Thành công"
          content="Yêu cầu của bạn đã được gửi đi thành công. Vui lòng kiểm tra email và làm theo hướng dẫn"
          type="success"
        />
      </ModalProvider>
    </Loader>
  );
};

export default ForgotPassword;
