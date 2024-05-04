'use client';
import React, { useRef, useState } from 'react';
import Warning from 'assets/svg/alert-triangle.svg';
import ModalProvider from 'components/ModalProvider';
import { isBlank, uuid } from 'utils/common';
import Loader from 'components/Loader';
import { Formik } from 'formik';
import TextInput from 'elements/TextInput';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';

type Props = { questionId: string };

const FeedbackBtn = (props: Props) => {
  const [modal, setModal] = useState(false);
  const componentId = useRef(uuid());
  const { trigger: createFeedback } = useMutation('/api/v1/feedbacks', {
    url: '/api/v1/feedbacks',
    method: METHOD.POST,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Gửi feedback',
      content: 'Gửi feedback thành công',
    },
    onSuccess() {
      handleClose();
    },
  });
  const handleClose = () => {
    setModal(false);
  };
  const handleShow = () => {
    setModal(true);
  };
  const handleSubmit = (values: { content: string }) => {
    createFeedback({
      type: 'QUESTION',
      questionId: props.questionId,
      content: values.content,
    });
  };
  return (
    <div>
      <Warning
        onClick={handleShow}
        data-tooltip-id="default-tooltip"
        data-tooltip-content="feedback"
        className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
      />

      <ModalProvider show={modal} onClose={handleClose}>
        <Loader
          id={componentId.current}
          className="w-screen max-w-screen-md p-6"
        >
          <div className="flex flex-col mb-5">
            <div className="text-lg font-bold text-gray-900">Feedback</div>
            <div className="text-sm font-normal text-gray-500">
              Nhập nội dung cần phản hồi
            </div>
          </div>
          <Formik
            initialValues={{
              content: '',
            }}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              touched,
              errors,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextInput
                  label="Nội dung"
                  name="content"
                  placeholder="Nội dung ..."
                  className="mb-8"
                  type="textarea"
                  onChange={handleChange}
                  value={values.content}
                  onBlur={handleBlur}
                  hasError={touched.content && !isBlank(errors.content)}
                  errorMessage={errors.content}
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn flex-1"
                    onClick={handleClose}
                  >
                    Đóng
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Xác nhận
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </Loader>
      </ModalProvider>
    </div>
  );
};

export default FeedbackBtn;
