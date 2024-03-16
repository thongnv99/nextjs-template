'use client';
import Editor from 'components/Editor';
import RadioGroup from 'elements/RadioGroup';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { QUESTION_TYPE } from 'global';
import { IQuestion } from 'interfaces';
import React from 'react';

const DoQuestion = (props: {
  question?: IQuestion;
  id: string;
  inResult?: boolean;
  idx?: number;
  answer?: string | string[];
  onChange(answer: string | string[]): void; // array when type = fill blank
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
            value={props.answer as string}
            labelClassName={`!text-gray-900`}
            onChange={value => props.onChange(String(value))}
            options={props.question?.options?.map(item => ({
              label: item,
              value: item,
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
    </div>
  );
};

export default DoQuestion;
