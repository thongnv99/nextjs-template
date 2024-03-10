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
import PaginationBar from 'components/PaginationBar';

type Props = { compact?: boolean };

const ExamMgmt = ({ compact }: Props) => {
  const componentId = useRef(uuid());
  const [examModal, setExamModal] = useState<{ show: boolean; data?: IExam }>({
    show: false,
  });
  const router = useRouter();
  const { lng } = useParams();
  const [type, setType] = useState('');
  const [currPage, setCurrPage] = useState(1);

  const { data, isLoading, mutate } = useSWRWrapper<ExamRes>(`/api/v1/exams`, {
    url: '/api/v1/exams',
    params: {
      // ...(!isBlank(type) && {
      //   type,
      // }),
      page: currPage,
      limit: 10,
    },
    revalidateOnFocus: false,
  });

  const handleCreateExam = () => {
    setExamModal({ show: true });
    // router.push(`/${lng}/question/question-form`);
  };

  const handleRefresh = () => {
    mutate();
  };
  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
      className="h-full w-full border border-gray-200 rounded-lg bg-white flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Danh sách đề thi</div>
        {!compact && (
          <button
            type="button"
            className="btn-primary btn-icon"
            onClick={handleCreateExam}
          >
            <Plus /> Thêm đề thi
          </button>
        )}
      </div>
      <div className=" px-5 flex-1 w-full flex flex-col gap-2 overflow-y-scroll">
        {data?.items.map(item => (
          <ExamItem
            compact={compact}
            key={item.id}
            data={item}
            onRefresh={handleRefresh}
          />
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
