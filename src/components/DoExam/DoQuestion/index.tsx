'use client';
import { Disclosure, Transition } from '@headlessui/react';
import Editor from 'components/Editor';
import RadioGroup from 'elements/RadioGroup';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { QUESTION_TYPE } from 'global';
import ArrowRight from 'assets/svg/arrow-right.svg';
import Chevron from 'assets/svg/chevron-down.svg';
import { IQuestion } from 'interfaces';
import React from 'react';
import { QUESTION_STATUS_TRANSLATE } from 'global/translate';

const DoQuestion = (props: {
  question?: IQuestion;
  id: string;
  inResult?: boolean;
  idx?: number;
  answer?: string | string[];
  showAnswer?: boolean;
  onChange(answer: string | string[] | number): void; // array when type = fill blank
}) => {
  const getBlankOptions = (content: string) => {
    const el = document.createElement('div');
    el.innerHTML = content;
    const options = el.getElementsByTagName('code');
    return new Array(options.length).fill('') as string[];
  };

  return (
    <div id={props.id} className="rounded-md  p-4 bg-white">
      <div className="flex mb-4 gap-4">
        <div className="whitespace-nowrap">Câu {props.idx}:</div>
        <div
          className="font-bold"
          dangerouslySetInnerHTML={{ __html: props.question?.content ?? '' }}
        ></div>
      </div>
      <div>
        {props.question?.type === QUESTION_TYPE.MULTIPLE_CHOICE && (
          <RadioGroup
            className={'flex-col gap-2'}
            value={String(props.answer)}
            labelClassName={`!text-gray-900`}
            onChange={value => props.onChange(Number(value))}
            options={props.question?.options?.map((item, idx) => ({
              label: item,
              value: String(idx),
            }))}
          />
        )}

        {props.question?.type === QUESTION_TYPE.ESSAY && (
          <Editor data={props.answer as string} onChange={props.onChange} />
        )}

        {props.question?.type === QUESTION_TYPE.FILL_IN_THE_BLANK && (
          <Formik
            initialValues={{
              answers: getBlankOptions(props.question?.content ?? ''),
            }}
            onSubmit={values => {
              props.onChange(values.answers);
            }}
          >
            {({ values, handleSubmit, setFieldValue, handleChange }) => (
              <div className="flex flex-col gap-4 w-full">
                {values.answers.map((item, idx) => (
                  <div className="flex gap-2 items-center" key={idx}>
                    <div>[({idx})] :</div>
                    <TextInput
                      className="flex-1"
                      value={values.answers[idx]}
                      name={`answers[${idx}]`}
                      onChange={e => {
                        handleChange(e);
                        setTimeout(() => {
                          handleSubmit();
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Formik>
        )}
      </div>
      {props.question && props.showAnswer && (
        <div className="mt-4">
          <Disclosure>
            {({ open }) => {
              return (
                <div className="w-full flex flex-col question-item">
                  <Disclosure.Button>
                    <div className="flex p-2 items-center justify-between transition duration-75 bg-primary-200">
                      <div className="   flex gap-2 items-center">Đáp án:</div>
                      {props.question!.answerExplain && (
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
                      <div className="p-2 bg-primary-50">
                        <div className="   flex gap-2 items-center className='font-bold'">
                          Đáp án:
                          <strong>{props.question!.correctOption! + 1}</strong>
                        </div>
                      </div>
                      {props.question!.answerExplain && (
                        <div className="p-2 bg-primary-50">
                          <div className="font-bold">Giải thích đáp án</div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: props.question!.answerExplain ?? '',
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
};

export default DoQuestion;
