import { Formik, FormikProps } from 'formik';
import Lock from 'assets/svg/lock.svg';
import React, { useEffect, useRef } from 'react';
import TextInput from 'elements/TextInput';
import { isBlank } from 'utils/common';
import Loader from 'components/Loader';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { ACCOUNT_PROFILE_INFO, ACCOUNT_UPDATE_PROFILE } from 'store/key';
import { GENDER, METHOD } from 'global';
import * as yup from 'yup';
import { passwordRegex } from 'global/regex';
import RadioGroup from 'elements/RadioGroup';
import { RestResponse } from 'interfaces';
import { User } from 'next-auth';
import { formatDateToString, formatStringToDate } from 'utils/datetime';

interface UpdateProfileForm {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
}

const ProfileModal = (props: { onClose?: () => void }) => {
  const componentId = useRef();
  const formRef = useRef<FormikProps<UpdateProfileForm>>();
  const { data: userInfo, isLoading } = useSWRWrapper<{ user: User }>(
    ACCOUNT_PROFILE_INFO,
    {
      url: '/api/v1/verifyAccessToken',
      method: METHOD.POST,
      revalidateOnFocus: false,
      auth: true,
    },
  );

  const { trigger } = useMutation(ACCOUNT_UPDATE_PROFILE, {
    url: '/api/v1/users/me',
    method: METHOD.POST,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'Cập nhật thông tin tài khoản',
      content: 'Cập nhật thông tin tài khoản thành công',
    },
    onSuccess() {
      props.onClose?.();
    },
  });

  useEffect(() => {
    console.log({ userInfo });
    if (userInfo) {
      const data = userInfo.user;
      formRef.current?.setValues({
        firstName: data?.firstName!,
        lastName: data?.lastName!,
        email: data?.email!,
        phoneNumber: data?.phoneNumber!,
        gender: data?.gender!,
        dob:
          (data?.dob! &&
            formatDateToString(
              formatStringToDate(data.dob, 'dd/MM/yyyy'),
              'yyyy-MM-dd',
            )) ??
          '',
      });
    }
  }, [userInfo]);
  const handleUpdateProfile = (values: UpdateProfileForm) => {
    trigger({
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      gender: values.gender,
    });
  };

  const schema = yup.object().shape({
    name: yup
      .string()
      .label('Mật khẩu cũ')
      .required()
      .matches(passwordRegex, 'Mật khẩu yếu'),
  });

  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
      className="flex flex-col w-[35rem] p-4 pt-5 items-center"
    >
      <div className="text-lg font-bold mb-8">Thông tin tài khoản</div>
      <Formik
        initialValues={
          {
            firstName: userInfo?.user?.firstName!,
            lastName: userInfo?.user?.lastName!,
            email: userInfo?.user?.email!,
            phoneNumber: userInfo?.user?.phoneNumber!,
            gender: userInfo?.user?.gender!,
            dob:
              (userInfo?.user?.dob! &&
                formatDateToString(
                  formatStringToDate(userInfo?.user?.dob, 'dd/MM/yyyy'),
                  'yyyy-MM-dd',
                )) ??
              '',
          } as UpdateProfileForm
        }
        onSubmit={handleUpdateProfile}
        innerRef={instance => (formRef.current = instance!)}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
          setFieldValue,
        }) => (
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            <TextInput
              label="Họ"
              className="mb-1"
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
              hasError={touched.lastName && !isBlank(errors.lastName)}
              errorMessage={errors.lastName}
            />
            <TextInput
              label="Tên"
              className="mb-1"
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
              hasError={touched.firstName && !isBlank(errors.firstName)}
              errorMessage={errors.firstName}
            />
            <TextInput
              label="Email"
              className="mb-1"
              name="email"
              type="text"
              readOnly
              disabled
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              hasError={touched.email && !isBlank(errors.email)}
              errorMessage={errors.email}
            />
            <TextInput
              label="Ngày sinh"
              className="mb-1"
              name="dob"
              type="date"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.dob}
              hasError={touched.dob && !isBlank(errors.dob)}
              errorMessage={errors.dob}
            />
            <TextInput
              label="Số điện thoại"
              className="mb-1"
              name="phoneNumber"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phoneNumber}
              hasError={touched.phoneNumber && !isBlank(errors.phoneNumber)}
              errorMessage={errors.phoneNumber}
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

            <div className="flex flex-col gap-3 w-full">
              <button type="submit" className="btn-primary ">
                Xác nhận
              </button>
              <button type="button" className="btn " onClick={props.onClose}>
                Hủy bỏ
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default ProfileModal;
