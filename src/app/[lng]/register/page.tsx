'use client';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import Mail from 'assets/svg/mail.svg';
import Lock from 'assets/svg/lock.svg';
import React from 'react';
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
        <div className="mb-[4.8rem] text-[4.8rem] text-center">Đăng ký</div>
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
              <button type="submit" className="btn-primary ">
                Đăng nhập
              </button>

              <div className="text-center">
                Bạn đã có tài khoản{' '}
                <Link
                  href={`/${lng}/${ROUTES.LOGIN}`}
                  className="text-[1.6rem] text-[var(--color-1)] cursor-pointer"
                >
                  đăng nhập ngay?
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
