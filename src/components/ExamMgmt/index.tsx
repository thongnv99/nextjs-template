'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import { QUESTION_TYPE } from 'global';
import { useSWRWrapper } from 'hooks/swr';
import { ExamRes, IExam, QuestionRes } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import ExamItem from 'components/ExamItem';
import ModalProvider from 'components/ModalProvider';
import ExamForm from 'components/ExamForm';

type Props = {};

const ExamMgmt = (props: Props) => {
  const componentId = useRef(uuid());
  const [examModal, setExamModal] = useState<{ show: boolean; data?: IExam }>({
    show: false,
  });
  const router = useRouter();
  const { lng } = useParams();
  const [type, setType] = useState('');

  const { data, isLoading, mutate } = useSWRWrapper<ExamRes>(`/api/v1/exams`, {
    url: '/api/v1/exams',
    params: {
      // ...(!isBlank(type) && {
      //   type,
      // }),
    },
    revalidateOnFocus: false,
  });

  const handleCreateExam = () => {
    setExamModal({ show: true });
    // router.push(`/${lng}/customer/question/question-form`);
  };

  const handleRefresh = () => {
    mutate();
  };
  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
      className="h-full w-full border border-gray-200 rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Danh sách đề thi</div>
        <button
          type="button"
          className="btn-primary btn-icon"
          onClick={handleCreateExam}
        >
          <Plus /> Thêm đề thi
        </button>
      </div>
      {/* <div className="h-[4.4rem] px-5 my-4 flex gap-2">
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
      </div> */}
      <div className=" px-5 flex-1 w-full flex flex-col gap-2 overflow-y-scroll">
        {data?.items.map(item => (
          <ExamItem key={item.id} data={item} onRefresh={handleRefresh} />
        ))}
      </div>

      <ModalProvider
        show={examModal.show}
        onClose={() => setExamModal({ show: false })}
      >
        <ExamForm
          onClose={() => setExamModal({ show: false })}
          onRefresh={handleRefresh}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ExamMgmt;
