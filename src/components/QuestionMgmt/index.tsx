'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useRef } from 'react';
import { uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';

type Props = {};

const QuestionMgmt = (props: Props) => {
  const componentId = useRef(uuid());

  const handleCreateQuestion = () => {
    console.log('question');
  };
  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border border-gray-200 rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Danh sách câu hỏi</div>
        <button
          type="button"
          className="btn-primary btn-icon"
          onClick={handleCreateQuestion}
        >
          <Plus /> Thêm câu hỏi
        </button>
      </div>
      <div className="h-[4.4rem] px-5 my-4 flex gap-2">
        <div className="max-w-lg">
          <TextInput
            leadingIcon={<Search />}
            placeholder="Nhập nội dung câu hỏi"
          />
        </div>
      </div>
      <div className=" px-5 flex-1 w-full flex flex-col gap-2 overflow-y-scroll">
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
      </div>
    </Loader>
  );
};

export default QuestionMgmt;
