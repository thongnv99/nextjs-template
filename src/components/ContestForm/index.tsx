import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IContest, IFlashCard } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useSWRConfig } from 'swr';
import { isBlank, uuid } from 'utils/common';

type ContestFormProps = {
  data?: IContest; // for edit
  onClose(): void;
  onRefresh(): void;
};

interface ContestInput {
  title: string;
  description: string;
  startTime?: string;
  endTime?: string;
}

const ContestForm = (props: ContestFormProps) => {
  const componentId = useRef(uuid());
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { lng } = useParams();
  const { trigger: createContest } = useMutation<Record<string, unknown>>(
    'EXAM_CREATE_CONTEST',
    {
      url: '/api/v1/contests',
      method: METHOD.POST,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Thêm cuộc thi',
        content: 'Thêm cuộc thi thành công.',
      },
      onSuccess(data) {
        props.onClose();
        router.push(`/${lng}/contest/config/${data?.result?.id}`);
      },
    },
  );
  const { trigger: updateContest } = useMutation('EXAM_UPDATE_CONTEST', {
    url: '/api/v1/contests/{contestId}',
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
  const handleSubmit = (values: ContestInput) => {
    if (props.data) {
      updateContest({
        ...values,
        contestId: props.data.id,
      });
    } else {
      createContest({
        ...values,
        status: 'DRAFT',
        ...(values.startTime && {
          startTime: new Date(values.startTime).getTime(),
        }),
        ...(values.endTime && {
          endTime: new Date(values.endTime).getTime(),
        }),
      });
    }
  };
  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">Cuộc thi</div>
        <div className="text-sm font-normal text-gray-500">
          Nhập thông tin cho cuộc thi
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
              placeholder="Tên cuộc thi..."
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.title && !isBlank(errors.title)}
              errorMessage={errors.title}
            />
            <div className="flex gap-3">
              <TextInput
                label="Bắt đầu"
                name="startTime"
                className="mb-3 flex-1"
                type="date"
                placeholder="Thời gian bắt đầu"
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.startTime && !isBlank(errors.startTime)}
                errorMessage={errors.startTime}
              />
              <TextInput
                label="Kết thúc"
                name="endTime"
                type="date"
                className="mb-3 flex-1"
                placeholder="Thời gian kết thúc"
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.endTime && !isBlank(errors.endTime)}
                errorMessage={errors.endTime}
              />
            </div>
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

export default ContestForm;
