import { Formik } from 'formik';
import Lock from 'assets/svg/lock.svg';
import React, { useRef } from 'react';
import TextInput from 'elements/TextInput';
import { isBlank } from 'utils/common';
import Loader from 'components/Loader';
import { useMutation } from 'hooks/swr';
import { ACCOUNT_CHANGE_PASSWORD } from 'store/key';
import { METHOD } from 'global';

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
  return (
    <Loader
      id={componentId.current}
      className="flex flex-col w-[30rem] px-4 py-8 items-center"
    >
      <div className="text-lg font-bold mb-8">Đổi mật khẩu</div>
      <Formik initialValues={{}} onSubmit={handleChangePassword}>
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => (
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            <TextInput
              label="Mật khẩu cũ"
              name="password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              hasError={touched.password && !isBlank(errors.password)}
              errorMessage={errors.password}
              leadingIcon={<Lock />}
            />
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
            <button type="submit" className="btn-primary ">
              Xác nhận
            </button>
            <button type="button" className="btn " onClick={props.onClose}>
              Hủy bỏ
            </button>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default ChangePassword;
