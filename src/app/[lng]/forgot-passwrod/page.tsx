'use client';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { signIn } from 'next-auth/react';
import Mail from 'assets/svg/mail.svg';
import Lock from 'assets/svg/lock.svg';
import React from 'react';
import Checkbox from 'elements/CheckBox';
import GoogleIcon from 'assets/svg/google.svg';
import Link from 'next/link';
import { ROUTES } from 'global';
import { useParams } from 'next/navigation';

interface LoginForm {
  username: string;
  password: string;
  savePassword?: boolean;
}

const Login = () => {
  const { lng } = useParams();
  const handleLogin = (values: LoginForm) => {
    console.log('handle login', values);
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className=" flex-1 px-[3.2rem]">
        <div className="mb-[4.8rem] text-[4.8rem] text-center">Đăng nhập</div>
        <Formik
          onSubmit={handleLogin}
          initialValues={{ username: '', password: '' }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[3.2rem]"
            >
              <TextInput
                label="Email"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                leadingIcon={<Mail />}
                placeholder="example@gmail.com"
              />
              <TextInput
                label="Mật khẩu"
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
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
                  href={`${lng}/${ROUTES.FORGOT_PASSWORD}`}
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
              <div>
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
    </div>
  );
};

export default Login;
