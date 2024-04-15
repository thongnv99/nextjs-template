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
import { ACCOUNT_REGISTER } from 'store/key';
import { isBlank, uuid } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import { useSWRConfig } from 'swr';
import ModalProvider from 'components/ModalProvider';
import NoticeModal from 'components/NoticeModal';
import { passwordRegex } from 'global/regex';

interface RegisterForm {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  address?: string;
  dob?: Date;
  gender?: string;
}

const Register = () => {
  const { lng } = useParams();
  const componentId = useRef(uuid());
  const loading = useRef(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const { trigger: requestRegister } = useMutation(ACCOUNT_REGISTER, {
    method: METHOD.POST,
    url: '/api/v1/register',
    loading: true,
    componentId: componentId.current,
    onSuccess(data) {
      console.log(data);
      requestVerifyEmail({
        email: data.user.email,
      });
    },
    onError(error) {
      setErrorMessage(error.message);
    },
  });

  const { trigger: requestVerifyEmail } = useMutation(
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
    firstName: yup.string().label('Tên').required(),
    lastName: yup.string().label('Họ').required(),
    email: yup.string().label('Email').required().email(),
    password: yup
      .string()
      .label('Mật khẩu')
      .required()
      .matches(passwordRegex, 'Mật khẩu yếu'),
    confirmPassword: yup
      .string()
      .label('Xác nhận mật khẩu')
      .required()
      .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  });
  const handleRegister = (values: RegisterForm) => {
    const payload = {
      ...values,
      dob: values.dob
        ? formatDateToString(new Date(values.dob), 'dd/MM/yyyy')
        : null,
      confirmPassword: undefined,
    };
    loading.current = !loading.current;
    setErrorMessage(null);

    requestRegister(payload);
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
        <div className="mb-[4.8rem] text-[4.8rem] text-center">Đăng ký</div>
        {!isBlank(errorMessage!) && (
          <div className="mb-[4.8rem] text-[1.6rem] text-center text-red-600">
            {errorMessage}
          </div>
        )}
        <Formik
          onSubmit={handleRegister}
          validationSchema={schema}
          initialValues={{
            gender: GENDER.MALE,
          }}
          validateOnChange
          validateOnBlur
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
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
                  label="Họ"
                  name="lastName"
                  value={values.lastName}
                  className="col-span-1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  hasError={touched.lastName && !isBlank(errors.lastName)}
                  errorMessage={errors.lastName}
                />
                <TextInput
                  label="Tên"
                  name="firstName"
                  value={values.firstName}
                  className="col-span-1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  hasError={touched.firstName && !isBlank(errors.firstName)}
                  errorMessage={errors.firstName}
                />
                <TextInput
                  label="Ngày sinh"
                  name="dob"
                  type="date"
                  value={values.dob as unknown as string}
                  className="col-span-1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                <div className="input-container">
                  <label className="input-label" htmlFor="">
                    Giới tính
                  </label>
                  <div className="flex-1 items-center flex">
                    <RadioGroup
                      value={values.gender}
                      onChange={value => setFieldValue('gender', value)}
                      options={[
                        { label: 'Nam', value: GENDER.MALE },
                        { label: 'Nữ', value: GENDER.FEMALE },
                      ]}
                    />
                  </div>
                </div>
                <TextInput
                  label="Số điện thoại"
                  name="phoneNumber"
                  type="text"
                  value={values.phoneNumber}
                  className="col-span-2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  hasError={touched.phoneNumber && !isBlank(errors.phoneNumber)}
                  errorMessage={errors.phoneNumber}
                />
                <TextInput
                  label="Email"
                  name="email"
                  value={values.email}
                  className="col-span-2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  leadingIcon={<Mail />}
                  hasError={touched.email && !isBlank(errors.email)}
                  errorMessage={errors.email}
                />
                <div className="col-span-2">
                  <TextInput
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    leadingIcon={<Lock />}
                    hasError={touched.password && !isBlank(errors.password)}
                    errorMessage={errors.password}
                  />
                  <div className="text-sm font-normal text-gray-500">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 3 thành
                    phần là chữ hoa, chữ thường, số và ký hiệu đặc biệt.
                  </div>
                </div>
                <TextInput
                  label="Xác nhận mật khẩu"
                  className="col-span-2"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
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
                Đăng ký
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
      <ModalProvider show={successModal} onClose={handleHiddenSuccess}>
        <NoticeModal
          onConfirm={handleHiddenSuccess}
          title="Thành công"
          content="Bạn đã đăng ký thành công tài khoản. <br/> Vui lòng quay lại trang đăng nhập để truy cập vào hệ thống"
          type="success"
        />
      </ModalProvider>
    </Loader>
  );
};

export default Register;
