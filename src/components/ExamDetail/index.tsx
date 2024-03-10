'use client';
import ConfirmModal from 'components/ConfirmModal';
import EmptyData from 'components/EmptyData';
import Loader from 'components/Loader';
import ModalProvider from 'components/ModalProvider';
import { useSWRWrapper } from 'hooks/swr';
import { IExam } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { formatDateToString } from 'utils/datetime';

const ExamDetail = (props: { examId?: string }) => {
  const {
    data: examData,
    isLoading,
    error,
  } = useSWRWrapper<IExam>(`/api/v1/exams/${props.examId}`, {
    url: `/api/v1/exams/${props.examId}`,
  });
  const { lng } = useParams();
  const router = useRouter();

  const [modal, setModal] = useState<{
    show?: boolean;
    hasSaveSession?: boolean;
  }>({ show: false });

  const handleBack = () => {
    router.push(`/${lng}/exam`);
  };

  const handleDoExam = () => {
    router.push(
      `/${lng}/exam/do-exam/${props.examId}?has-save-session=${modal.hasSaveSession}`,
    );
    setModal({ show: false });
  };

  const questionCount = examData?.parts.reduce(
    (prev, curr) => prev + curr.questions.length,
    0,
  );
  const data = [
    {
      label: 'Ngày tạo',
      value: examData?.createdAt
        ? formatDateToString(new Date(examData.createdAt), 'dd/MM/yyyy')
        : '--',
    },
    {
      label: 'Thời gian làm bài',
      value: `${examData?.duration} phút`,
    },
    {
      label: 'Phần thi',
      value: `${examData?.parts.length} phần`,
    },
    {
      label: 'Câu hỏi',
      value: `${questionCount} câu`,
    },
  ];

  return (
    <Loader
      loading={isLoading}
      className="w-full h-full bg-white rounded-lg border border-gray-200 my-auto py-10"
    >
      {error != null ? (
        <EmptyData type="error" />
      ) : (
        <div className=" h-full w-full flex flex-col items-center ">
          <div className="text-5xl mb-4">{examData?.title}</div>
          <div className="text-2xl text-gray-500 mb-2">
            {examData?.description}
          </div>
          <div className=" mb-8">
            {data.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-14">
                <div className="text-gray-600">{item.label}</div>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mb-10">
            <strong>Hướng dẫn:</strong> Chọn <strong>Thi thử</strong> để tính
            thời gian làm bài. chọn <strong>Luyện tập</strong> để không bị giới
            hạn thời gian làm bài!
          </div>
          <div className="flex gap-8">
            <button className="btn" type="button" onClick={handleBack}>
              Quay lại
            </button>

            <button
              className="btn !bg-primary-50"
              type="button"
              onClick={() => setModal({ show: true, hasSaveSession: true })}
            >
              Luyện tập
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={() => setModal({ show: true, hasSaveSession: false })}
            >
              Thi thử
            </button>
          </div>
        </div>
      )}

      <ModalProvider
        show={modal.show}
        onClose={() => setModal({ show: false })}
      >
        <ConfirmModal
          title={modal.hasSaveSession ? 'Luyện tập' : 'Thi thử'}
          content={
            modal.hasSaveSession
              ? 'Bạn có chắc chắn muốn luyện tập'
              : 'Thời gian làm bài sẽ được tính khi chọn Bắt đầu'
          }
          onConfirm={handleDoExam}
          onCancel={() => setModal({ show: false })}
          labelConfirm="Bắt đầu"
          type={'warning'}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ExamDetail;
