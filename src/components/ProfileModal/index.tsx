'use client';
import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef } from 'react';
import { User } from 'next-auth';
import * as yup from 'yup';
import { GENDER, METHOD } from 'global';
import { passwordRegex } from 'global/regex';
import { ACCOUNT_PROFILE_INFO, ACCOUNT_UPDATE_PROFILE } from 'store/key';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { isBlank } from 'utils/common';
import { formatDateToString, formatStringToDate } from 'utils/datetime';
import TextInput from 'elements/TextInput';
import Loader from 'components/Loader';
import RadioGroup from 'elements/RadioGroup';
import { useTranslation } from 'app/i18n/client';

interface UpdateProfileForm {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
}

const ProfileModal = (props: { onClose?: () => void }) => {
  const { t } = useTranslation();
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
      title: 'J_19',
      content: 'J_20',
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
    name: yup.string().label('J_21').required().matches(passwordRegex, 'J_22'),
  });

  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
      className="flex flex-col w-[35rem] p-4 pt-5 items-center"
    >
      <div className="text-lg font-bold mb-8">{t('J_16')}</div>
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
              label="J_23"
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
              label="J_24"
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
              label="J_25"
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
              label="J_26"
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
              label="J_27"
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
                {t('J_28')}
              </label>
              <div className="flex-1 items-center flex">
                <RadioGroup
                  value={values.gender}
                  onChange={value => setFieldValue('gender', value)}
                  options={[
                    { label: 'J_29', value: GENDER.MALE },
                    { label: 'J_30', value: GENDER.FEMALE },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button type="submit" className="btn-primary ">
                {t('C_1')}
              </button>
              <button type="button" className="btn " onClick={props.onClose}>
                {t('C_2')}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default ProfileModal;
