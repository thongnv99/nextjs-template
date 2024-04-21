import { useTranslation } from 'app/i18n/client';
import ExamPicker from 'components/ExamPicker';
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
  onSelect(exam?: IExam): void;
  onClose(): void;
};

interface ExamSelectInput {
  exam?: IExam;
}

const SelectExamForm = (props: ExamFormProps) => {
  const { t } = useTranslation();
  const componentId = useRef(uuid());

  const handleSubmit = (values: ExamSelectInput) => {
    props.onSelect(values.exam);
  };
  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-sm p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">
          {t('Chọn đề thi')}
        </div>
      </div>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
            <ExamPicker
              label="Đề thi"
              placeholder="Chọn đề thi"
              onChange={value => setFieldValue('exam', value)}
            />

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

export default SelectExamForm;
