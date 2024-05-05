'use client';
import { useTranslation } from 'app/i18n/client';
import Badge from 'components/Badge';
import QuestionMgmt from 'components/QuestionMgmt';
import Checkbox from 'elements/CheckBox';
import Dropdown from 'elements/Dropdown';
import { Formik, FormikProps } from 'formik';
import { QUESTION_LEVEL } from 'global';
import {
  QuestionTypeOptions,
  SampleOptions,
  YearOptions,
} from 'global/options';
import { LEVEL_TRANSLATE, QUESTION_TYPE_TRANSLATE } from 'global/translate';
import { useSWRWrapper } from 'hooks/swr';
import { IQuestion, QuestionRes } from 'interfaces';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { isBlank } from 'utils/common';

interface QuestionPickerProps {
  onSelect?: (questions: IQuestion[]) => void;
  onClose?: () => void;
}

interface QuestionPickerValues {
  questions: Array<IQuestion>;
}
const mapColor = {
  [QUESTION_LEVEL.MEDIUM]: 'bg-yellow-100 text-yellow-500',
  [QUESTION_LEVEL.EASY]: 'bg-green-100 text-green-500',
  [QUESTION_LEVEL.HARD]: 'bg-red-100 text-red-500',
};
const QuestionPicker = (props: QuestionPickerProps) => {
  const formRef = useRef<FormikProps<QuestionPickerValues>>();
  const { t } = useTranslation();

  const handleSubmit = (values: QuestionPickerValues) => {
    props.onSelect?.(values.questions);
    props.onClose?.();
  };

  return (
    <div className="w-screen max-w-screen-md p-2 md:p-6 transition-all duration-500 h-[90vh] flex flex-col">
      <Formik
        innerRef={instance => (formRef.current = instance!)}
        onSubmit={handleSubmit}
        initialValues={{ questions: [] } as QuestionPickerValues}
      >
        {({ values, setFieldValue }) => (
          <>
            <div className="flex justify-between mb-5">
              <div className="text-lg font-bold text-gray-900">{t('J_41')}</div>
              <div className="text-base  text-gray-500">
                {t('J_42')}: <strong>{values.questions.length}</strong>
              </div>
            </div>
            <div className="flex-1 mt-2">
              <QuestionMgmt
                inPicker
                onRowCheckedChange={(data, checked) => {
                  if (checked) {
                    setFieldValue('questions', [...values.questions, data]);
                  } else {
                    setFieldValue(
                      'questions',
                      [...values.questions].filter(item => item.id !== data.id),
                    );
                  }
                }}
              />
            </div>
          </>
        )}
      </Formik>
      <div className="flex gap-3 mt-8">
        <button type="button" className="btn flex-1" onClick={props.onClose}>
          Đóng
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={() => {
            formRef.current?.submitForm();
          }}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default QuestionPicker;
