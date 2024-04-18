import { useTranslation } from 'app/i18n/client';
import Loader from 'components/Loader';
import Checkbox from 'elements/CheckBox';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IExam } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef } from 'react';
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
  const { t } = useTranslation();
  const componentId = useRef(uuid());
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
        title: 'J_63',
        content: 'J_64',
      },
      onSuccess(data) {
        props.onClose();
        router.push(`/${lng}/exam/config/${data.id}`);
      },
    },
  );
  const { trigger: updateExam } = useMutation('EXAM_UPDATE_EXAM', {
    url: '/api/v1/exams/{examId}',
    method: METHOD.PUT,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'J_65',
      content: 'J_66',
    },
    onSuccess() {
      props.onClose();
      props.onRefresh();
    },
  });
  const handleSubmit = (values: FlashCardInput) => {
    if (props.data) {
      updateExam({
        examId: props.data.id,
        title: values.title,
        description: values.description,
      });
    } else {
      createExam(values as unknown as Record<string, unknown>);
    }
  };
  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">{t('J_1')}</div>
        <div className="text-sm font-normal text-gray-500">{t('J_69')}</div>
      </div>
      <Formik
        initialValues={{
          title: props.data?.title ?? '',
          description: props.data?.description ?? '',
          isSample: false,
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextInput
              label="J_24"
              name="title"
              className="mb-3"
              placeholder="J_67"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.title && !isBlank(errors.title)}
              errorMessage={errors.title}
            />
            <TextInput
              label="J_68"
              name="description"
              placeholder="J_68"
              className="mb-3"
              type="textarea"
              onChange={handleChange}
              value={values.description}
              onBlur={handleBlur}
              hasError={touched.description && !isBlank(errors.description)}
              errorMessage={errors.description}
            />
            {!props.data && (
              <Checkbox
                className="mb-8"
                selected={values.isSample}
                label="Đề mẫu"
                onChange={(_, value) => {
                  setFieldValue('isSample', value);
                }}
              />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                className="btn flex-1"
                onClick={props.onClose}
              >
                {t('J_61')}
              </button>
              <button type="submit" className="btn-primary flex-1">
                {t('C_1')}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default ExamForm;
