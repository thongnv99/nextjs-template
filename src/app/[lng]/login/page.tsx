'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as yup from 'yup';
import { Formik } from 'formik';
import { ROUTES } from 'global';
import { isBlank } from 'utils/common';
import TextInput from 'elements/TextInput';
import Checkbox from 'elements/CheckBox';
import Loader from 'components/Loader';
import Mail from 'assets/svg/mail.svg';
import Lock from 'assets/svg/lock.svg';
import GoogleIcon from 'assets/svg/google.svg';

interface LoginForm {
  email: string;
  password: string;
  savePassword?: boolean;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .label('Email')
    .required()
    .email(() => 'Email không hợp lệ'),
  password: yup.string().label('Mật khẩu').required(),
});

const Login = () => {
  const { lng } = useParams();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const handleLogin = async (values: LoginForm) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: values?.email,
        password: values?.password,
        redirect: false,
        callbackUrl: `${window.location.origin}/${lng}/home`,
      });
      if (res?.ok) {
        window.location.reload();
      } else {
        setErrorMessage(res?.error);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Loader
      loading={loading}
      className="w-full h-full flex items-center justify-center"
    >
      <div className=" flex-1 px-[3.2rem]">
        <div className="mb-[4.8rem] text-[4.8rem] text-center">Đăng nhập</div>
        {!isBlank(errorMessage!) && (
          <div className="mb-[4.8rem] text-[1.6rem] text-center text-red-600">
            {errorMessage}
          </div>
        )}
        <Formik
          onSubmit={handleLogin}
          validationSchema={schema}
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
                leadingIcon={<Mail />}
                placeholder="example@gmail.com"
              />
              <TextInput
                label="Mật khẩu"
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.password && !isBlank(errors.password)}
                errorMessage={errors.password}
                leadingIcon={<Lock />}
                placeholder="example@gmail.com"
              />
              <div className="flex justify-between">
                <Checkbox
                  label="Lưu đăng nhập"
                  selected={values.savePassword}
                  onChange={setFieldValue}
                  name="savePassword"
                />
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
                type="submit"
                className="btn flex items-center justify-center"
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
            </form>
          )}
        </Formik>
      </div>
      <div className="flex-[2] h-full bg-primary-500"></div>
    </Loader>
  );
};

export default Login;
