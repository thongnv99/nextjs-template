'use client';
import { Formik } from 'formik';
import Lock from 'assets/svg/lock.svg';
import React, { useRef } from 'react';
import TextInput from 'elements/TextInput';
import { isBlank } from 'utils/common';
import Loader from 'components/Loader';
import { useMutation } from 'hooks/swr';
import { ACCOUNT_CHANGE_PASSWORD } from 'store/key';
import { METHOD } from 'global';
import * as yup from 'yup';
import { passwordRegex } from 'global/regex';
import { useTranslation } from 'app/i18n/client';

interface ChangePasswordForm {
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const ChangePassword = (props: { onClose?: () => void }) => {
  const { t } = useTranslation();
  const componentId = useRef();
  const { trigger } = useMutation(ACCOUNT_CHANGE_PASSWORD, {
    url: '/api/v1/users/changePassword',
    method: METHOD.POST,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'J_17',
      content: 'J_32',
    },
    onSuccess() {
      props.onClose?.();
    },
  });
  const handleChangePassword = (values: ChangePasswordForm) => {
    trigger({ oldPassword: values.password, newPassword: values.newPassword });
  };

  const schema = yup.object().shape({
    password: yup
      .string()
      .label('J_21')
      .required()
      .matches(passwordRegex, 'J_22'),
    newPassword: yup
      .string()
      .label('J_33')
      .required()
      .matches(passwordRegex, 'J_22'),
    confirmNewPassword: yup
      .string()
      .label('J_34')
      .required()
      .oneOf([yup.ref('newPassword')], 'J_35'),
  });

  return (
    <Loader
      id={componentId.current}
      className="flex flex-col w-[35rem] p-4 pt-5 items-center"
    >
      <div className="text-lg font-bold mb-8">{t('J_17')}</div>
      <Formik
        validationSchema={schema}
        initialValues={{}}
        onSubmit={handleChangePassword}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => (
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <TextInput
                label="J_21"
                className="mb-1"
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                hasError={touched.password && !isBlank(errors.password)}
                errorMessage={errors.password}
                leadingIcon={<Lock />}
              />
              <div className="text-sm font-normal text-gray-500">
                {t('J_36')}
              </div>
            </div>
            <TextInput
              label="J_33"
              name="newPassword"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword}
              hasError={touched.newPassword && !isBlank(errors.newPassword)}
              errorMessage={errors.newPassword}
              leadingIcon={<Lock />}
            />
            <TextInput
              label="J_34"
              name="confirmNewPassword"
              type="password"
              value={values.confirmNewPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={
                touched.confirmNewPassword &&
                !isBlank(errors.confirmNewPassword)
              }
              errorMessage={errors.confirmNewPassword}
              leadingIcon={<Lock />}
            />
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

export default ChangePassword;
