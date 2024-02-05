import Editor from 'components/Editor';
import RadioGroup from 'elements/RadioGroup';
import { QUESTION_TYPE } from 'global';
import { IQuestion } from 'interfaces';
import React from 'react';

const DoQuestion = (props: {
  question?: IQuestion;
  idx?: number;
  answer?: string;
  onChange(answer: string): void;
}) => {
  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="flex mb-4 gap-4">
        <div>Câu {props.idx}:</div>
        <div
          dangerouslySetInnerHTML={{ __html: props.question?.content ?? '' }}
        ></div>
      </div>
      <div>
        {props.question?.type === QUESTION_TYPE.MULTIPLE_CHOICE && (
          <RadioGroup
            value={props.answer}
            onChange={props.onChange}
            options={props.question?.options?.map(item => ({
              label: item,
              value: item,
            }))}
          />
        )}

        {props.question?.type === QUESTION_TYPE.ESSAY && (
          <Editor data={props.answer} onChange={props.onChange} />
        )}
      </div>
    </div>
  );
};

export default DoQuestion;
