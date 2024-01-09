import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IFlashCard } from 'interfaces';
import React, { useRef } from 'react';
import { FLASH_CARD_QUERY_LIST } from 'store/key';
import { useSWRConfig } from 'swr';
import { isBlank, uuid } from 'utils/common';

type FlashCardForm = {
  data?: IFlashCard; // for edit
  onClose(): void;
  onRefresh(): void;
};

interface FlashCardInput {
  question: string;
  answer: string;
}

const FlashCardForm = (props: FlashCardForm) => {
  const componentId = useRef(uuid());
  const { mutate } = useSWRConfig();
  const { trigger: createFlashCard } = useMutation(
    'FLASH_CARD_CREATE_FLASH_CARD',
    {
      url: '/api/v1/flashcards',
      method: METHOD.POST,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Thêm flash card',
        content: 'Thêm flash card thành công.',
      },
      onSuccess() {
        props.onClose();
        props.onRefresh();
      },
    },
  );
  const { trigger: updateFlashCard } = useMutation(
    'FLASH_CARD_UPDATE_FLASH_CARD',
    {
      url: '/api/v1/flashcards/{flashcardId}',
      method: METHOD.PUT,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Cập nhật flash card',
        content: 'Cập nhật flash card thành công.',
      },
      onSuccess() {
        props.onClose();
        props.onRefresh();
      },
    },
  );
  const handleSubmit = (values: FlashCardInput) => {
    if (props.data) {
      updateFlashCard({
        ...values,
        flashcardId: props.data.id,
      });
    } else {
      createFlashCard(values as unknown as Record<string, unknown>);
    }
  };
  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">Flash Card</div>
        <div className="text-sm font-normal text-gray-500">
          Nhập nội dung câu hỏi và đáp án
        </div>
      </div>
      <Formik
        initialValues={{
          question: props.data?.question ?? '',
          answer: props.data?.answer ?? '',
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
              label="Câu hỏi"
              name="question"
              className="mb-3"
              type="textarea"
              placeholder="Nội dung câu hỏi..."
              value={values.question}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.question && !isBlank(errors.question)}
              errorMessage={errors.question}
            />
            <TextInput
              label="Đáp án"
              name="answer"
              placeholder="Đáp án ..."
              className="mb-8"
              onChange={handleChange}
              value={values.answer}
              onBlur={handleBlur}
              hasError={touched.answer && !isBlank(errors.answer)}
              errorMessage={errors.answer}
            />
            <div className="flex gap-3">
              <button
                type="button"
                className="btn flex-1"
                onClick={props.onClose}
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
  );
};

export default FlashCardForm;
