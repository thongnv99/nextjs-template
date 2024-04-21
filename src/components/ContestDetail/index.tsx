'use client';
import ConfirmModal from 'components/ConfirmModal';
import ContestHistory from 'components/ContestHistory';
import Loader from 'components/Loader';
import ModalProvider from 'components/ModalProvider';
import { METHOD } from 'global';
import { useSWRWrapper } from 'hooks/swr';
import { IContest } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { formatDateToString } from 'utils/datetime';

interface ContestDetailProps {
  contestId: string;
}

const ContestDetail = (props: ContestDetailProps) => {
  const router = useRouter();
  const { lng } = useParams();
  const [modal, setModal] = useState(false);
  const { data: contestData, isLoading } = useSWRWrapper<IContest>(
    `/api/v1/contests/${props.contestId}`,
    {
      method: METHOD.GET,
      url: `/api/v1/contests/${props.contestId}`,
    },
  );
  const questionCount = contestData?.parts.reduce(
    (prev, curr) => prev + curr.questions.length,
    0,
  );
  const data = [
    {
      label: 'Thời gian bắt đầu',
      value: contestData?.startTime
        ? formatDateToString(new Date(contestData?.startTime), 'dd/MM/yyyy')
        : '--',
    },
    {
      label: 'Thời gian kết thúc',
      value: contestData?.endTime
        ? formatDateToString(new Date(contestData?.endTime), 'dd/MM/yyyy')
        : '--',
    },
    {
      label: 'Thời gian làm bài',
      value: `${(contestData?.duration ?? 0) / 60 ?? '--'} phút`,
    },
    {
      label: 'Phần thi',
      value: `${contestData?.parts.length ?? '--'} phần`,
    },
    {
      label: 'Câu hỏi',
      value: `${questionCount ?? '--'} câu`,
    },
  ];

  const handleBack = () => {
    router.push(`/${lng}/contest`);
  };

  const handleDoContest = () => {
    router.push(`/${lng}/contest/do-contest/${props.contestId}`);
    setModal(false);
  };
  return (
    <Loader
      loading={isLoading}
      className="h-full w-full p-5 gap-4 border border-gray-200 rounded-lg bg-white flex flex-col shadow-sm"
    >
      <div className="flex flex-col items-center">
        <div className="text-5xl mb-4">{contestData?.title}</div>
        <div className="text-2xl text-gray-500 mb-2">
          {contestData?.description}
        </div>
        <div className=" mb-8">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-14">
              <div className="text-gray-600">{item.label}</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-8">
          <button className="btn" type="button" onClick={handleBack}>
            Quay lại
          </button>

          <button
            className="btn-primary"
            type="button"
            onClick={() => setModal(true)}
          >
            Bắt đầu
          </button>
        </div>
      </div>
      <div className="flex-1">
        <ContestHistory contestId={props.contestId} compact />
      </div>
      <ModalProvider show={modal} onClose={() => setModal(false)}>
        <ConfirmModal
          title={'Bắt đầu làm bài'}
          content="Thời gian sẽ được tính khi chọn bắt đầu."
          onConfirm={handleDoContest}
          onCancel={() => setModal(false)}
          labelConfirm="Bắt đầu"
          type={'success'}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ContestDetail;
