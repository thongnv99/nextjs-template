'use client';
import { useTranslation } from 'app/i18n/client';
import Badge from 'components/Badge';
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
  selected: Record<string, boolean>;
}
const mapColor = {
  [QUESTION_LEVEL.MEDIUM]: 'bg-yellow-100 text-yellow-500',
  [QUESTION_LEVEL.EASY]: 'bg-green-100 text-green-500',
  [QUESTION_LEVEL.HARD]: 'bg-red-100 text-red-500',
};
const QuestionPicker = (props: QuestionPickerProps) => {
  const [type, setType] = useState('');
  const [sample, setSample] = useState('');
  const [year, setYear] = useState('');
  const formRef = useRef<FormikProps<QuestionPickerValues>>();
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useSWRWrapper<QuestionRes>(
    `/api/v1/questions?type=${type}&isSample=${sample}&year=${year}`,
    {
      url: '/api/v1/questions',
      params: {
        ...(!isBlank(type) && {
          type,
        }),
        ...(!isBlank(sample) && {
          isSample: sample === 'true',
        }),
        ...(!isBlank(year) && {
          year,
        }),
        limit: 500,
      },
    },
  );

  useLayoutEffect(() => {
    if (data?.items) {
      formRef.current?.setFieldValue('questions', data?.items ?? []);
    }
  }, [data]);

  const handleSubmit = (values: QuestionPickerValues) => {
    props.onSelect?.(
      values.questions.filter(question => values.selected[question.id]),
    );
    props.onClose?.();
  };

  return (
    <div className="w-screen max-w-screen-md p-6 transition-all duration-500">
      <Formik
        innerRef={instance => (formRef.current = instance!)}
        onSubmit={handleSubmit}
        initialValues={{ questions: [], selected: {} } as QuestionPickerValues}
      >
        {({ values, setFieldValue }) => (
          <>
            <div className="flex justify-between mb-5">
              <div className="text-lg font-bold text-gray-900">{t('J_41')}</div>
              <div className="text-base  text-gray-500">
                {t('J_42')}: <strong>{0}</strong>
              </div>
            </div>
            <div className=" mb-4 flex gap-2">
              <div className="max-w-lg flex-1">
                <Dropdown
                  label="Loại câu hỏi"
                  placeholder="Loại câu hỏi"
                  className="w-full"
                  options={QuestionTypeOptions}
                  selected={type}
                  onChange={value => setType(value)}
                />
              </div>
              <div className="max-w-lg flex-1">
                <Dropdown
                  label="Câu hỏi mẫu"
                  placeholder="Câu hỏi mẫu"
                  className="w-full"
                  options={SampleOptions}
                  selected={sample}
                  onChange={value => setSample(value)}
                />
              </div>
              <div className="max-w-lg flex-1">
                <Dropdown
                  label="Năm"
                  placeholder="Năm"
                  className="w-full"
                  options={YearOptions}
                  selected={year}
                  onChange={value => setYear(value)}
                />
              </div>
            </div>
            <div className="flex">
              <div className="max-h-[70vh] min-h-[50vh] w-full overflow-y-auto flex flex-col gap-2">
                {values.questions.map((question, idx) => (
                  <div
                    key={question.id}
                    className="flex border border-primary-400 rounded-[0.8rem] p-4 justify-between"
                  >
                    <div className="flex">
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          {question.isSample && (
                            <Badge
                              content="J_43"
                              className="bg-green-100 text-green-500  text-[1rem]"
                            />
                          )}

                          <Badge
                            content={
                              QUESTION_TYPE_TRANSLATE[question.type] ?? ''
                            }
                            className="bg-red-100 text-red-500  text-[1rem]"
                          />
                          <Badge
                            content={question.year ?? ''}
                            className="bg-yellow-100 text-yellow-500  text-[1rem]"
                          />

                          <Badge
                            content={LEVEL_TRANSLATE[question.level]}
                            className={`${
                              mapColor[question.level]
                            } text-[1rem]`}
                          />
                        </div>
                        <div
                          dangerouslySetInnerHTML={{ __html: question.content }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-8">
                      <Checkbox
                        selected={values.selected[question.id]}
                        onChange={(_, value) => {
                          setFieldValue(`selected[${question.id}]`, value);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
