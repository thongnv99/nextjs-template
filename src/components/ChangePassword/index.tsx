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

interface ChangePasswordForm {
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const ChangePassword = (props: { onClose?: () => void }) => {
  const componentId = useRef();
  const { trigger } = useMutation(ACCOUNT_CHANGE_PASSWORD, {
    url: '/api/v1/users/changePassword',
    method: METHOD.POST,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'Đổi mật khẩu',
      content: 'Đổi mật khẩu thành công',
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
      .label('Mật khẩu cũ')
      .required()
      .matches(passwordRegex, 'Mật khẩu yếu'),
    newPassword: yup
      .string()
      .label('Mật khẩu mới')
      .required()
      .matches(passwordRegex, 'Mật khẩu yếu'),
    confirmNewPassword: yup
      .string()
      .label('Xác nhận mật khẩu')
      .required()
      .oneOf([yup.ref('newPassword')], 'Xác nhận mật khẩu không khớp'),
  });

  return (
    <Loader
      id={componentId.current}
      className="flex flex-col w-[35rem] p-4 pt-5 items-center"
    >
      <div className="text-lg font-bold mb-8">Đổi mật khẩu</div>
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
                label="Mật khẩu cũ"
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
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 3 thành phần
                là chữ hoa, chữ thường, số và ký hiệu đặc biệt.
              </div>
            </div>
            <TextInput
              label="Mật khẩu mới"
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
              label="Xác nhận mật khẩu mới"
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

export default ChangePassword;
