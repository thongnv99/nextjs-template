'use client';
import React, { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useParams, useRouter } from 'next/navigation';
import * as yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { METHOD, ROUTES } from 'global';
import { isBlank, uuid } from 'utils/common';
import TextInput from 'elements/TextInput';
import Loader from 'components/Loader';
import Mail from 'assets/svg/mail.svg';
import Lock from 'assets/svg/lock.svg';
import GoogleIcon from 'assets/svg/google.svg';
import { useMutation } from 'hooks/swr';
import { LOGIN_BY_GOOGLE } from 'store/key';
import { useTranslation } from 'app/i18n/client';
import ModalProvider from 'components/ModalProvider';
import NoticeModal from 'components/NoticeModal';

interface LoginForm {
  email: string;
  password: string;
  savePassword?: boolean;
}

const Login = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const router = useRouter();
  const componentId = useRef(uuid());
  const [successModal, setSuccessModal] = useState(false);
  const formRef = useRef<FormikProps<LoginForm>>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const { trigger: requestRegister } = useMutation(
    '/api/v1/users/requestVerifyEmail',
    {
      method: METHOD.POST,
      url: '/api/v1/users/requestVerifyEmail',
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

  const schema = yup.object().shape({
    email: yup
      .string()
      .label('Email')
      .required()
      .email(() => 'Email không hợp lệ'),
    password: yup.string().label('Mật khẩu').required(),
  });
  const { trigger: loginBuyGoogle } = useMutation<{ googleLoginUrl: string }>(
    LOGIN_BY_GOOGLE,
    {
      url: '/api/v1/loginByGoogle',
      method: METHOD.POST,
      onSuccess(data) {
        if (data?.googleLoginUrl) {
          router.replace(data.googleLoginUrl);
        }
      },
    },
  );

  const handleLogin = async (values: LoginForm) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: values?.email,
        password: values?.password,
        redirect: false,
        callbackUrl: `${window.location.origin}/${lng}`,
      });
      if (res?.ok) {
        window.location.reload();
      } else {
        console.log({ res });
        setErrorMessage(res?.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginByGoogle = async () => {
    setLoading(true);

    await loginBuyGoogle();

    setLoading(false);
  };
  const handleShowSuccess = () => {
    setSuccessModal(true);
  };
  const requestVerifyEmail = () => {
    requestRegister({
      email: formRef.current?.values.email,
    });
  };
  const handleHiddenSuccess = () => {
    setSuccessModal(false);
    setErrorMessage('');
  };
  return (
    <Loader
      loading={loading}
      className="w-full h-full flex items-center justify-center relative"
    >
      <div
        className="flex-[2] md:block hidden z-0 h-full bg-primary-50 absolute top-0
       left-0 right-0 bottom-0"
      ></div>
      <div className=" z-[1] flex-1 px-[3.2rem] max-w-[50rem] md:shadow-sm rounded-lg bg-white border-gray-400 p-7">
        <div className="mb-[4.8rem] text-[4.8rem] text-center">Đăng nhập</div>
        {!isBlank(errorMessage!) && (
          <>
            <div className="mb-[4.8rem] text-[1.6rem] text-center text-red-600">
              {t(errorMessage ?? '')}
              {errorMessage === '1011' && (
                <div
                  className="text-[1.4rem] text-primary-500 cursor-pointer"
                  onClick={requestVerifyEmail}
                >
                  Không nhận được email?
                </div>
              )}
            </div>
          </>
        )}
        <Formik
          onSubmit={handleLogin}
          validationSchema={schema}
          innerRef={instance => (formRef.current = instance!)}
          initialValues={{ email: '', password: '' }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            touched,
            errors,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[3.2rem]"
            >
              <TextInput
                label="Email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.email && !isBlank(errors.email)}
                errorMessage={errors.email}
                value={values.email}
                leadingIcon={<Mail />}
                placeholder="example@gmail.com"
              />
              <TextInput
                label="Mật khẩu"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.password && !isBlank(errors.password)}
                errorMessage={errors.password}
                leadingIcon={<Lock />}
              />
              <div className="flex justify-end">
                <Link
                  href={`/${lng}/${ROUTES.FORGOT_PASSWORD}`}
                  className="text-[1.6rem] text-[var(--color-1)] cursor-pointer"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <button type="submit" className="btn-primary ">
                Đăng nhập
              </button>
              <div className="flex items-center">
                <div className="flex-1 h-[0.1rem] bg-gray-600"></div>
                <div className="mx-2">hoặc</div>
                <div className="flex-1 h-[0.1rem] bg-gray-600"></div>
              </div>
              <button
                type="button"
                className="btn flex items-center justify-center"
                onClick={handleLoginByGoogle}
              >
                <GoogleIcon className="w-[2.4rem] h-[2.4rem] mr-[1.2rem]" />{' '}
                Đăng nhập với google
              </button>
              <div className="text-center">
                Bạn chưa có tài khoản{' '}
                <Link
                  href={`/${lng}/${ROUTES.REGISTER}`}
                  className="text-[1.6rem] text-[var(--color-1)] cursor-pointer"
                >
                  đăng ký ngay?
                </Link>
              </div>
              <button
                type="button"
                className="btn flex items-center justify-center"
                onClick={() => {
                  router.push(`/${lng}/blog`);
                }}
              >
                Blog
              </button>
            </form>
          )}
        </Formik>
      </div>
      <ModalProvider show={successModal} onClose={handleHiddenSuccess}>
        <NoticeModal
          onConfirm={handleHiddenSuccess}
          title="Gửi yêu cầu thành công"
          content="Email xác thực đã được gửi đến hòm thư của bạn. Vui lòng kiểm tra email và làm theo hướng dẫn!"
          type="success"
        />
      </ModalProvider>
    </Loader>
  );
};

export default Login;
