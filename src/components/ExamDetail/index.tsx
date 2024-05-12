'use client';
import { useTranslation } from 'app/i18n/client';
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
  const { t } = useTranslation();
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
      label: 'J_174',
      value: examData?.createdAt
        ? formatDateToString(new Date(examData.createdAt), 'dd/MM/yyyy')
        : '--',
    },
    {
      label: 'J_96',
      value: `${(examData?.duration ?? 0) / 60 ?? '--'} ${t('J_130')}`,
    },
    {
      label: 'J_97',
      value: t('J_52', { count: examData?.parts.length as number }),
    },
    {
      label: 'J_3',
      value: t('J_53', { count: questionCount as number }),
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
        <div className=" h-full w-full flex flex-col items-center justify-center px-2">
          <div className="text-5xl mb-4 text-center">{examData?.title}</div>
          <div className="text-2xl text-gray-500 mb-2 text-center">
            {examData?.description}
          </div>
          <div className=" mb-8">
            {data.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-14">
                <div className="text-gray-600">{t(item.label)}</div>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
          <div
            className="mb-10"
            dangerouslySetInnerHTML={{ __html: t('J_175') as string }}
          ></div>
          <div className="flex gap-8">
            <button className="btn" type="button" onClick={handleBack}>
              {t('J_98')}
            </button>

            <button
              className="btn !bg-primary-50"
              type="button"
              onClick={() => setModal({ show: true, hasSaveSession: true })}
            >
              {t('J_176')}
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={() => setModal({ show: true, hasSaveSession: false })}
            >
              {t('J_177')}
            </button>
          </div>
        </div>
      )}

      <ModalProvider
        show={modal.show}
        onClose={() => setModal({ show: false })}
      >
        <ConfirmModal
          title={modal.hasSaveSession ? 'J_176' : 'J_177'}
          content={modal.hasSaveSession ? 'J_178' : 'J_179'}
          onConfirm={handleDoExam}
          onCancel={() => setModal({ show: false })}
          labelConfirm="J_99"
          type={'success'}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ExamDetail;
