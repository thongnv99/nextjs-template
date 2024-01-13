'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import Dropdown from 'elements/Dropdown';
import { QUESTION_TYPE } from 'global';
import { useSWRWrapper } from 'hooks/swr';
import { QuestionRes } from 'interfaces';
const QuestionTypeOptions = [
  {
    label: 'Trắc nghiệm',
    value: QUESTION_TYPE.MULTIPLE_CHOICE,
  },
  {
    label: 'Điền vào chỗ trống',
    value: QUESTION_TYPE.FILL_IN_THE_BLANK,
  },
  {
    label: 'Tự luận',
    value: QUESTION_TYPE.ESSAY,
  },
];
type Props = {};

const QuestionMgmt = (props: Props) => {
  const componentId = useRef(uuid());
  const [type, setType] = useState('');

  const { data, isLoading } = useSWRWrapper<QuestionRes>(
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

  const handleCreateQuestion = () => {
    console.log('question');
  };
  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
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
        <div className="max-w-lg flex-1">
          <Dropdown
            placeholder="Loại câu hỏi"
            className="w-full"
            options={QuestionTypeOptions}
            selected={type}
            onChange={value => setType(value)}
          />
        </div>
      </div>
      <div className=" px-5 flex-1 w-full flex flex-col gap-2 overflow-y-scroll">
        {data?.items.map(item => (
          <QuestionItem key={item.id} data={item} />
        ))}
      </div>
    </Loader>
  );
};

export default QuestionMgmt;
