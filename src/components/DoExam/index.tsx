'use client';
import React, { useEffect, useRef, useState } from 'react';
import DoQuestion from './DoQuestion';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { DoExamRes, IExam, IPart, IQuestion, SubmitExamRes } from 'interfaces';
import { METHOD, QUESTION_TYPE } from 'global';
import TimeViewer, { TimeViewerHandle } from 'components/TimeViewer';
import Preload from 'components/Preload';
import { Formik } from 'formik';
import { isBlank, uuid } from 'utils/common';
import Loader from 'components/Loader';
import { formatDateToString } from 'utils/datetime';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ModalProvider from 'components/ModalProvider';
import ConfirmModal from 'components/ConfirmModal';
import { differenceInMinutes, subMinutes } from 'date-fns';
import PercentChart from 'components/PercentChart';
import ExamResult from './ExamResult';

const DoExam = (props: { examId: string; isContest?: boolean }) => {
  const [modalNext, setModalNext] = useState(false);
  const router = useRouter();
  const { lng } = useParams();
  const search = useSearchParams();
  const hasSaveSession = search.get('has-save-session') === 'true';
  const [expModal, setExpModal] = useState(false);
  const [submitModal, setSubmitModal] = useState({
    show: false,
    hasSaveSession: false,
  });

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, []);
  const beforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
  };
  const { data: examData } = useSWRWrapper<IExam>(
    `/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`,
    {
      url: `/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`,
    },
  );
  const componentId = useRef(uuid());
  const {
    data: exam,
    trigger,
    isMutating,
  } = useMutation<DoExamRes>(`/api/v1/joinExam`, {
    url: `/api/v1/joinExam`,
    method: METHOD.POST,
    onSuccess() {
      console.log('success', timerController.current);
    },
  });
  const { trigger: submitExam, data: result } = useMutation<SubmitExamRes>(
    `/api/v1/submitExam`,
    {
      url: `/api/v1/submitExam`,
      method: METHOD.POST,
      loading: true,
      componentId: componentId.current,
      notification: {
        title: 'Nộp bài',
        content: 'Nộp bài thành công',
      },
      onSuccess(data) {
        if (data.result?.status === 'SESSION_PAUSE') {
          router.push(`/${lng}/exam/history/${examData?.id}`);
        }
        console.log('success', timerController.current);
        setSubmitModal({ show: false, hasSaveSession: hasSaveSession });
      },
    },
  );

  const timerController = useRef<TimeViewerHandle>();

  useEffect(() => {
    trigger(
      props.isContest
        ? {
            source: 'CONTEST',
            contestId: props.examId,
            hasSaveSession: hasSaveSession,
          }
        : {
            source: 'EXAM',
            examId: props.examId,
            hasSaveSession: hasSaveSession,
          },
    );
  }, [hasSaveSession, props.examId, props.isContest, trigger]);

  const onSubmit = (values: { parts: IPart[] | undefined }) => {
    submitExam({
      sessionId: exam?.result?.sessionId,
      answersByPart: values.parts?.map((part, idx) => ({
        part: idx,
        answers: part.questions.map(question => question.answer ?? ''),
      })),
      hasSaveSession: submitModal.hasSaveSession,
    });
  };
  if (isMutating) {
    return <Preload />;
  }

  if (result && result.result?.status !== 'SESSION_PAUSE') {
    const resultData = result.result;
    return <ExamResult exam={examData} data={resultData} />;
  }

  const checkQuestionFinished = (question: IQuestion) => {
    if (question.type !== QUESTION_TYPE.FILL_IN_THE_BLANK) {
      return !isBlank(question.answer as string);
    }

    return (question.answer as string[])?.every(item => !isBlank(item));
  };

  return (
    <Loader
      id={componentId.current}
      className=" w-full max-w-screen-lg m-auto pb-6"
    >
      <div className="mb-8">
        <h1 className="text-center text-[3rem]">{examData?.title}</h1>
      </div>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          parts: exam?.result?.parts,
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="w-full flex  gap-8">
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {values.parts?.map((part, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-6 bg-white p-4 border border-gray-200"
                >
                  <h2 className="font-bold">Phần {idx + 1}</h2>
                  {part?.questions.map((item, questionIdx) => (
                    <DoQuestion
                      id={item.id}
                      answer={item.answer}
                      onChange={answer =>
                        setFieldValue(
                          `parts[${idx}].questions[${questionIdx}].answer`,
                          answer,
                        )
                      }
                      key={questionIdx}
                      question={item}
                      idx={questionIdx + 1}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="min-w-[30rem] sticky h-screen pb-[12rem] top-0 right-0  flex flex-col gap-4">
              <div className=" w-full border border-gray-200 bg-white p-4 rounded-md flex flex-col gap-8">
                {!hasSaveSession && (
                  <div className="w-full mb-4">
                    <div>Thời gian còn lại</div>
                    <TimeViewer
                      initTime={examData?.duration ?? 0}
                      ref={timerController}
                      onExp={() => {
                        setExpModal(true);
                      }}
                    />
                  </div>
                )}
                <button
                  className="btn-primary w-full"
                  type="button"
                  onClick={() => {
                    setSubmitModal({ show: true, hasSaveSession: false });
                  }}
                >
                  Nộp bài
                </button>
                {/* <button
                  className="btn-primary w-full"
                  type="button"
                  onClick={() => {
                    setSubmitModal({ show: true, hasSaveSession: true });
                  }}
                >
                  Lưu phiên thi
                </button> */}
              </div>
              <div className=" flex-1 overflow-y-auto w-full border border-gray-200 bg-white p-4 rounded-md ">
                {values.parts?.map((part, idx) => (
                  <div key={idx}>
                    <h2 className="text-[2rem] mb-2">Phần {idx + 1}</h2>
                    <div className="grid grid-cols-5 gap-4">
                      {part?.questions.map((item, idx) => (
                        <div
                          className={` border ${
                            checkQuestionFinished(item) ? 'bg-gray-200' : ''
                          } aspect-square cursor-pointer border-gray-200 w-full flex items-center justify-center rounded-[50%]`}
                          key={idx}
                          onClick={() => {
                            const element = document.getElementById(item.id);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {idx + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ModalProvider show={expModal} onClose={() => {}}>
              <ConfirmModal
                onConfirm={() => {
                  handleSubmit();
                }}
                labelConfirm={'Nộp bài'}
                type="warning"
                title="Hết thời gian"
                content={'Thời gian làm bài đã hết'}
              />
            </ModalProvider>
            <ModalProvider
              show={submitModal.show}
              onClose={() => {
                setSubmitModal({ show: false, hasSaveSession: false });
              }}
            >
              <ConfirmModal
                onConfirm={() => {
                  handleSubmit();
                }}
                labelConfirm={submitModal.hasSaveSession ? 'Lưu' : 'Nộp bài'}
                type="success"
                title={
                  submitModal.hasSaveSession
                    ? 'Lưu bài thi'
                    : 'Hoàn thành bải thi'
                }
                content={
                  submitModal.hasSaveSession
                    ? 'Phiện thi sẽ được hệ thống lưu lại, bạn có thể quay lại để tiếp tục luyện tập'
                    : 'Vui lòng kiểm tra kĩ đáp án trước khi nộp bài'
                }
              />
            </ModalProvider>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default DoExam;
