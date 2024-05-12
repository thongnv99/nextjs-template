import { useTranslation } from 'app/i18n/client';
import Loader from 'components/Loader';
import Checkbox from 'elements/CheckBox';
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
  hasPassword?: boolean;
  password?: string;
}

const ContestForm = (props: ContestFormProps) => {
  const componentId = useRef(uuid());
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { lng } = useParams();
  const { t } = useTranslation();
  const { trigger: createContest } = useMutation<Record<string, unknown>>(
    'EXAM_CREATE_CONTEST',
    {
      url: '/api/v1/contests',
      method: METHOD.POST,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'J_102',
        content: 'J_103',
      },
      onSuccess(data) {
        props.onClose();
        router.push(`/${lng}/contest/config/${data?.id}`);
      },
    },
  );
  const { trigger: updateContest } = useMutation('EXAM_UPDATE_CONTEST', {
    url: '/api/v1/contests/{contestId}',
    method: METHOD.PUT,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'J_104',
      content: 'J_105',
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
        <div className="text-lg font-bold text-gray-900">{t('J_2')}</div>
        <div className="text-sm font-normal text-gray-500">{t('J_106')}</div>
      </div>
      <Formik
        initialValues={{
          title: props.data?.title ?? '',
          description: props.data?.description ?? '',
          hasPassword: props.data?.hasPassword,
          password: props.data?.password,
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
              placeholder="J_107"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.title && !isBlank(errors.title)}
              errorMessage={errors.title}
            />
            <div className="flex gap-3">
              <TextInput
                label="J_99"
                name="startTime"
                className="mb-3 flex-1"
                type="date"
                placeholder="J_108"
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.startTime && !isBlank(errors.startTime)}
                errorMessage={errors.startTime}
              />
              <TextInput
                label="J_109"
                name="endTime"
                type="date"
                className="mb-3 flex-1"
                placeholder="J_110"
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.endTime && !isBlank(errors.endTime)}
                errorMessage={errors.endTime}
              />
            </div>

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

            <div className="mb-3">
              <Checkbox
                label="J_111"
                selected={values.hasPassword}
                name="hasPassword"
                onChange={(name, value) => setFieldValue('hasPassword', value)}
              />
            </div>
            {values.hasPassword && (
              <TextInput
                label="J_112"
                name="password"
                placeholder="J_112"
                className="mb-3"
                onChange={handleChange}
                value={values.password}
                onBlur={handleBlur}
                hasError={touched.password && !isBlank(errors.password)}
                errorMessage={errors.password}
              />
            )}
            <div className="flex gap-3 mt-8">
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

export default ContestForm;
