'use client';
import ArrowRight from 'assets/svg/arrow-right.svg';
import { Disclosure, Transition } from '@headlessui/react';
import { IPart } from 'interfaces';
import React, { useRef, useState } from 'react';
import { QUESTION_STATUS_TRANSLATE } from 'global/translate';
import Chevron from 'assets/svg/chevron-down.svg';
import { METHOD, QUESTION_TYPE } from 'global';
import RadioGroup from 'elements/RadioGroup';
import Loader from 'components/Loader';
import { useMutation } from 'hooks/swr';
import { uuid } from 'utils/common';
import { Formik, FormikProps } from 'formik';
import TextInput from 'elements/TextInput';
import Editor from 'components/Editor';

type Props = {
  data: Record<string, unknown>;
  onClose(): void;
  onRefresh(): void;
};

interface EssayResult {
  score: number;
  note: string;
}

interface EssayResultForm {
  essayResult: Record<string, EssayResult>;
}

const ContestResult = (props: Props) => {
  const [essayResult, setEssayResult] = useState<Record<string, unknown>>({});
  const componentId = useRef(uuid());
  const formRef = useRef<FormikProps<EssayResultForm>>();
  const parts = props.data.parts as IPart[];
  const { trigger } = useMutation('/api/v1/admin/examHistories/mark', {
    url: '/api/v1/admin/examHistories/mark',
    componentId: componentId.current,
    method: METHOD.POST,
    loading: true,
    notification: {
      title: 'Chấm điểm',
      content: 'Chấm điểm thành công',
    },
    onSuccess() {
      props.onClose();
      props.onRefresh();
    },
  });

  const handleRequest = () => {
    formRef.current?.submitForm();
  };

  const onSubmit = (values: EssayResultForm) => {
    const essayResult = values.essayResult;
    const questions: Record<string, unknown>[] = [];
    parts.forEach(part => {
      part.questions.forEach(question => {
        if (question.type === QUESTION_TYPE.ESSAY) {
          questions.push({
            id: question.id,
            ...essayResult[question.id],
          });
        }
      });
    });

    trigger({
      examHistoryId: props.data.id,
      questions,
    });
  };

  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md ">
      <div className="w-full flex flex-col items-center p-4">
        <div>{`${(props.data.userId as any).firstName as string} ${
          (props.data.userId as any).lastName as string
        }`}</div>
      </div>
      <Formik
        initialValues={{ essayResult: {} } as EssayResultForm}
        onSubmit={onSubmit}
        innerRef={instance => {
          formRef.current = instance!;
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <div className="max-h-[60vh] w-full overflow-y-auto">
            <div className="p-4">
              {parts?.map((part, idx) => (
                <div key={idx} className="flex flex-col ">
                  <h2 className="font-bold">Phần {idx + 1}</h2>
                  {part?.questions.map((question, questionIdx) => {
                    return (
                      <div
                        key={questionIdx}
                        className=" px-4 py-8 bg-white border-b border-b-gray-400"
                      >
                        <div className="flex mb-4 gap-4">
                          <div className="whitespace-nowrap">
                            Câu {questionIdx + 1}:
                          </div>
                          <div
                            className="font-bold"
                            dangerouslySetInnerHTML={{
                              __html: question?.content ?? '',
                            }}
                          ></div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {question.options?.map((option, optionIdx) => (
                            <div
                              className={`flex gap-4 items-center  p-2 rounded-sm
                          ${
                            String(question.userAnswer).includes(
                              String(optionIdx),
                            ) &&
                            !question.correctOption?.includes(String(optionIdx))
                              ? 'bg-red-200'
                              : ''
                          } 
                          ${
                            question.correctOption?.includes(String(optionIdx))
                              ? 'bg-green-200'
                              : ''
                          }`}
                              key={optionIdx}
                            >
                              <div>{optionIdx + 1}:</div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: option,
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>
                        {question.type === QUESTION_TYPE.ESSAY && (
                          <div className="flex flex-col px-2">
                            <div>Bài làm:</div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: question.userAnswer as string,
                              }}
                            ></div>
                          </div>
                        )}
                        {question.type === QUESTION_TYPE.ESSAY &&
                          props.data.status === 'MARK_PENDING' && (
                            <div className="mt-2">
                              <div>Chấm bài: </div>
                              <TextInput
                                type="number"
                                max={question.score}
                                min={0}
                                value={values.essayResult[question.id]?.score}
                                name={`essayResult[${question.id}].score`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label={`Điểm (Tối đa ${question.score} điểm)`}
                              />
                              <div className="input-container mb-4">
                                <label className="input-label">Ghi chú</label>
                                <Editor
                                  data={values.essayResult[question.id]?.note}
                                  placeholder="Nội dung câu hỏi..."
                                  onChange={data =>
                                    setFieldValue(
                                      `essayResult[${question.id}].note`,
                                      data,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        {(question.type !== QUESTION_TYPE.ESSAY ||
                          props.data?.status !== 'MARK_PENDING') && (
                          <div className="mt-4">
                            <Disclosure>
                              {({ open }) => {
                                return (
                                  <div className="w-full flex flex-col question-item">
                                    <Disclosure.Button>
                                      <div className="flex items-center justify-between transition duration-75 bg-primary-200">
                                        {question.type !==
                                        QUESTION_TYPE.ESSAY ? (
                                          <div className="  p-2 flex gap-2 items-center">
                                            Đáp án đúng:{' '}
                                            <strong>
                                              {String(question!.correctOption)
                                                ?.split(',')
                                                .map(item => Number(item) + 1)
                                                .join(', ')}
                                            </strong>
                                            <ArrowRight />
                                            <strong className="uppercase">
                                              {
                                                QUESTION_STATUS_TRANSLATE[
                                                  question.status
                                                ]
                                              }
                                            </strong>
                                          </div>
                                        ) : (
                                          <div className=" p-2 flex gap-2 items-center">
                                            Điểm:{' '}
                                            <strong>
                                              {question.adminScore}
                                            </strong>
                                          </div>
                                        )}
                                        {(question.answerExplain ||
                                          question.adminNote) && (
                                          <div className="flex gap-8">
                                            <Chevron
                                              className={`${
                                                open ? 'rotate-180' : ''
                                              } w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transform transition duration-75`}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </Disclosure.Button>
                                    <Transition
                                      show={open}
                                      enter="transition-all duration-100 ease-out"
                                      enterFrom="transform h-0 opacity-0"
                                      enterTo="transform  opacity-100"
                                      leave="transition-all duration-100 ease-out"
                                      leaveFrom="transform  opacity-100"
                                      leaveTo="transform h-0 opacity-0"
                                      className="overflow-hidden "
                                    >
                                      <Disclosure.Panel static>
                                        {(question.answerExplain ||
                                          question.adminNote) && (
                                          <div className="p-2 bg-primary-50">
                                            <div>Giải thích đáp án</div>
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  question.adminNote ??
                                                  question.answerExplain ??
                                                  '',
                                              }}
                                            ></div>
                                          </div>
                                        )}
                                      </Disclosure.Panel>
                                    </Transition>
                                  </div>
                                );
                              }}
                            </Disclosure>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </Formik>
      <div className="p-4 flex gap-8 items-center justify-center">
        <button onClick={props.onClose} className="btn" type="button">
          Hủy bỏ
        </button>
        {props.data?.status === 'MARK_PENDING' && (
          <button className="btn-primary" type="button" onClick={handleRequest}>
            Cập nhật điểm
          </button>
        )}
      </div>
    </Loader>
  );
};

export default ContestResult;
