'use client';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import * as yup from 'yup';
import Mail from 'assets/svg/mail.svg';
import Lock from 'assets/svg/lock.svg';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { GENDER, METHOD, ROUTES } from 'global';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  userId?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const schema = yup.object().shape({
  newPassword: yup.string().label('Mật khẩu mới').required(),
  confirmPassword: yup
    .string()
    .label('Xác nhận mật khẩu')
    .required()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
});

const ResetPassword = () => {
  const { lng } = useParams();
  const search = useSearchParams();

  const componentId = useRef(uuid());
  const loading = useRef(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const { trigger: requestRegister } = useMutation(
    ACCOUNT_REQUEST_RESET_PASSWORD,
    {
      method: METHOD.POST,
      url: '/api/v1/users/confirmResetPassword',
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

  const handleRegister = (values: ForgotForm) => {
    loading.current = !loading.current;
    setErrorMessage(null);
    const userId = search.get('user-id');
    const code = search.get('code');
    requestRegister({ newPassword: values.newPassword, userId, code });
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
          Đặt lại mật khẩu
        </div>
        {!isBlank(errorMessage!) && (
          <div className="mb-[4.8rem] text-[1.6rem] text-center text-red-600">
            {errorMessage}
          </div>
        )}
        <Formik
          onSubmit={handleRegister}
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
                  label="Mật khẩu mới"
                  className="col-span-2"
                  name="newPassword"
                  type="password"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  leadingIcon={<Lock />}
                  hasError={touched.newPassword && !isBlank(errors.newPassword)}
                  errorMessage={errors.newPassword}
                />
                <TextInput
                  label="Xác nhận mật khẩu"
                  className="col-span-2"
                  name="confirmPassword"
                  type="password"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  leadingIcon={<Lock />}
                  hasError={
                    touched.confirmPassword && !isBlank(errors.confirmPassword)
                  }
                  errorMessage={errors.confirmPassword}
                />
              </div>
              <button
                disabled={!isValid}
                type="submit"
                className="btn-primary "
              >
                Xác nhận
              </button>
            </form>
          )}
        </Formik>
      </div>
      <ModalProvider show={successModal} onClose={handleHiddenSuccess}>
        <NoticeModal
          onConfirm={handleHiddenSuccess}
          title="Thành công"
          content="Mật khẩu của bạn đã được cập nhật thành công. "
          type="success"
        />
      </ModalProvider>
    </Loader>
  );
};

export default ResetPassword;
