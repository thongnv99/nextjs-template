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
import { useParams, useRouter } from 'next/navigation';
import PaginationBar from 'components/PaginationBar';
const QuestionTypeOptions = [
  {
    label: 'Tất cả',
    value: '',
  },
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

const SampleOptions = [
  {
    label: 'Tất cả',
    value: '',
  },
  {
    label: 'Câu hỏi mẫu',
    value: 'true',
  },
  {
    label: 'Câu hỏi thường',
    value: 'false',
  },
];
type Props = {};

const QuestionMgmt = (props: Props) => {
  const componentId = useRef(uuid());
  const router = useRouter();
  const { lng } = useParams();
  const [type, setType] = useState('');
  const [sample, setSample] = useState('');
  const [currPage, setCurrPage] = useState(1);

  const { data, isLoading, mutate } = useSWRWrapper<QuestionRes>(
    `/api/v1/questions?type=${type}&page=${currPage}&isSample=${sample}`,
    {
      url: '/api/v1/questions',
      params: {
        ...(!isBlank(type) && {
          type,
        }),
        ...(!isBlank(sample) && {
          isSample: sample === 'true',
        }),
        page: currPage,
        limit: 200,
      },
    },
  );

  const handleCreateQuestion = () => {
    router.push(`/${lng}/question/question-form`);
  };

  const handleRefresh = () => {
    mutate();
  };
  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
      className="h-full w-full border bg-white border-gray-200 rounded-lg  flex flex-col shadow-sm"
    >
      <div className="p-5 pb-0 flex items-center justify-between">
        <div className="text-lg font-semibold">Danh sách câu hỏi</div>
        <button
          type="button"
          className="btn-primary btn-icon"
          onClick={handleCreateQuestion}
        >
          <Plus /> Thêm câu hỏi
        </button>
      </div>
      <div className="px-5 mb-4 flex gap-2">
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
      </div>
      <div className=" px-5  pb-5 flex-1 w-full flex flex-col gap-2 overflow-y-scroll">
        {data?.items.map(item => (
          <QuestionItem key={item.id} data={item} onRefresh={handleRefresh} />
        ))}
      </div>
      <div></div>
    </Loader>
  );
};

export default QuestionMgmt;
