import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IExam, IFlashCard } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { FLASH_CARD_QUERY_LIST } from 'store/key';
import { useSWRConfig } from 'swr';
import { isBlank, uuid } from 'utils/common';

type ExamFormProps = {
  data?: IExam; // for edit
  onClose(): void;
  onRefresh(): void;
};

interface FlashCardInput {
  title: string;
  description: string;
}

const ExamForm = (props: ExamFormProps) => {
  const componentId = useRef(uuid());
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { lng } = useParams();
  const { trigger: createExam } = useMutation<Record<string, unknown>>(
    'EXAM_CREATE_EXAM',
    {
      url: '/api/v1/exams',
      method: METHOD.POST,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Thêm đề thi',
        content: 'Thêm đề thi thành công.',
      },
      onSuccess(data) {
        props.onClose();
        router.push(`/${lng}/customer/exam/config/${data?.result?.id}`);
      },
    },
  );
  const { trigger: updateExam } = useMutation('EXAM_UPDATE_EXAM', {
    url: '/api/v1/exams/{examId}',
    method: METHOD.PUT,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Cập nhật đề thi',
      content: 'Cập nhật đề thi thành công.',
    },
    onSuccess() {
      props.onClose();
      props.onRefresh();
    },
  });
  const handleSubmit = (values: FlashCardInput) => {
    if (props.data) {
      updateExam({
        ...values,
        examId: props.data.id,
      });
    } else {
      createExam(values as unknown as Record<string, unknown>);
    }
  };
  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">Đề thi</div>
        <div className="text-sm font-normal text-gray-500">
          Nhập tên và mô tả cho đề thi
        </div>
      </div>
      <Formik
        initialValues={{
          title: props.data?.title ?? '',
          description: props.data?.description ?? '',
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
              label="Tên"
              name="title"
              className="mb-3"
              placeholder="Tên đề thi..."
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.title && !isBlank(errors.title)}
              errorMessage={errors.title}
            />
            <TextInput
              label="Mô tả"
              name="description"
              placeholder="Mô tả"
              className="mb-8"
              type="textarea"
              onChange={handleChange}
              value={values.description}
              onBlur={handleBlur}
              hasError={touched.description && !isBlank(errors.description)}
              errorMessage={errors.description}
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

export default ExamForm;
