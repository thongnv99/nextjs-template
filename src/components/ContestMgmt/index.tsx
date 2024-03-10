'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import { QUESTION_TYPE, ROLES } from 'global';
import { useSWRWrapper } from 'hooks/swr';
import { ContestRes, ExamRes, IExam, QuestionRes } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import ContestItem from 'components/ContestItem';
import ModalProvider from 'components/ModalProvider';
import ContestForm from 'components/ContestForm';
import PaginationBar from 'components/PaginationBar';
import { useUserInfo } from 'hooks/common';

const ContestMgmt = ({ compact }: { compact?: boolean }) => {
  const { data: userInfo } = useUserInfo();
  const componentId = useRef(uuid());
  const [examModal, setExamModal] = useState<{ show: boolean; data?: IExam }>({
    show: false,
  });
  const router = useRouter();
  const { lng } = useParams();
  const [type, setType] = useState('');
  const [currPage, setCurrPage] = useState(1);

  const { data, isLoading, mutate } = useSWRWrapper<ContestRes>(
    `/api/v1/contests`,
    {
      url: '/api/v1/contests',
      params: {
        // ...(!isBlank(type) && {
        //   type,
        // }),
        page: currPage,
        limit: 10,
      },
      revalidateOnFocus: false,
    },
  );

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
      className="h-full w-full border border-gray-200 rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="text-lg font-semibold">
          {compact ? 'Cuộc thi' : 'Danh sách cuộc thi'}
        </div>
        {!compact && userInfo?.user.role === ROLES.ADMIN && (
          <button
            type="button"
            className="btn-primary btn-icon"
            onClick={handleCreateExam}
          >
            <Plus /> Thêm cuộc thi
          </button>
        )}
      </div>
      <div className=" px-5 flex-1 w-full flex flex-col gap-2 overflow-y-scroll">
        {data?.items.map(item => (
          <ContestItem
            compact={compact}
            key={item.id}
            data={item}
            onRefresh={handleRefresh}
          />
        ))}
        {/* <div className="mt-auto">
          <PaginationBar
            page={currPage}
            onChangePage={setCurrPage}
            totalPages={data?.pagination.totalPage ?? 0}
          />
        </div> */}
      </div>

      <ModalProvider
        show={examModal.show}
        onClose={() => setExamModal({ show: false })}
      >
        <ContestForm
          onClose={() => setExamModal({ show: false })}
          onRefresh={handleRefresh}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ContestMgmt;
