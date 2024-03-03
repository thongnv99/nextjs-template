'use client';
import Badge from 'components/Badge';
import Checkbox from 'elements/CheckBox';
import { Formik, FormikProps } from 'formik';
import { QUESTION_TYPE_TRANSLATE } from 'global/translate';
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
  selected: string[];
}

const QuestionPicker = (props: QuestionPickerProps) => {
  const [type, setType] = useState('');
  const formRef = useRef<FormikProps<QuestionPickerValues>>();

  const { data, isLoading, mutate } = useSWRWrapper<QuestionRes>(
    `/api/v1/questions?type=${type}`,
    {
      url: '/api/v1/questions',
      params: {
        ...(!isBlank(type) && {
          type,
        }),
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
      values.questions.filter(question =>
        values.selected.includes(question.id),
      ),
    );
    props.onClose?.();
  };
  return (
    <div className="w-screen max-w-screen-sm p-6 transition-all duration-500">
      <Formik
        innerRef={instance => (formRef.current = instance!)}
        onSubmit={handleSubmit}
        initialValues={{ questions: [], selected: [] } as QuestionPickerValues}
      >
        {({ values, setFieldValue }) => (
          <>
            <div className="flex justify-between mb-5">
              <div className="text-lg font-bold text-gray-900">
                Ngân hàng câu hỏi của tôi
              </div>
              <div className="text-base  text-gray-500">
                đã chọn: <strong>{values.selected.length}</strong>
              </div>
            </div>
            <div className="max-h-[80vh] w-full overflow-y-auto flex flex-col gap-2">
              {values.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="flex border border-primary-400 rounded-[0.8rem] p-4 justify-between"
                >
                  <div className="flex">
                    <div
                      dangerouslySetInnerHTML={{ __html: question.content }}
                    ></div>
                    <div className="flex">
                      {question.isSample && (
                        <Badge
                          content="Mẫu"
                          className="bg-green-100 text-green-500 ml-4 -translate-y-[0.8rem] text-[1rem]"
                        />
                      )}

                      <Badge
                        content={QUESTION_TYPE_TRANSLATE[question.type] ?? ''}
                        className="bg-red-100 text-red-500 ml-4 -translate-y-[0.8rem] text-[1rem]"
                      />
                    </div>
                  </div>
                  <div>
                    <Checkbox
                      selected={values.selected.includes(question.id)}
                      onChange={(_, value) => {
                        if (value) {
                          setFieldValue('selected', [
                            ...values.selected,
                            question.id,
                          ]);
                        } else {
                          setFieldValue(
                            'selected',
                            [...values.selected].filter(
                              item => item !== question.id,
                            ),
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
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
