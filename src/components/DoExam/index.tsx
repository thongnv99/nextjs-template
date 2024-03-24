'use client';
import React, { useEffect, useRef, useState } from 'react';
import DoQuestion from './DoQuestion';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { DoExamRes, IExam, IPart, IQuestion, SubmitExamRes } from 'interfaces';
import { METHOD, QUESTION_TYPE } from 'global';
import TimeViewer, { TimeViewerHandle } from 'components/TimeViewer';
import Preload from 'components/Preload';
import { Formik, FormikProps } from 'formik';
import { isBlank, uuid } from 'utils/common';
import Loader from 'components/Loader';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ModalProvider from 'components/ModalProvider';
import ConfirmModal from 'components/ConfirmModal';
import ExamResult from './ExamResult';

const DoExam = (props: { examId: string; isContest?: boolean }) => {
  const router = useRouter();
  const { lng } = useParams();
  const search = useSearchParams();
  const hasSaveSession = search.get('has-save-session') === 'true';
  const sessionId = search.get('session');
  const [expModal, setExpModal] = useState(false);
  const [submitModal, setSubmitModal] = useState({
    show: false,
    hasSaveSession: false,
  });
  const formRef = useRef<FormikProps<{ parts: IPart[] | undefined }>>();

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      formRef.current?.handleSubmit();
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
            hasSaveSession: !isBlank(sessionId) ? true : hasSaveSession,
            ...(!isBlank(sessionId) && {
              examHistoryId: sessionId,
            }),
          },
    );
  }, [hasSaveSession, props.examId, props.isContest, sessionId, trigger]);

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
  const checkQuestionFinished = (question: IQuestion) => {
    if (question.type !== QUESTION_TYPE.FILL_IN_THE_BLANK) {
      return !isBlank(question.answer as string);
    }

    return (question.answer as string[])?.every(item => !isBlank(item));
  };

  if (isMutating) {
    return <Preload />;
  }

  if (result && result.result?.status !== 'SESSION_PAUSE') {
    const resultData = result.result;
    return <ExamResult exam={examData} data={resultData} />;
  }
  const parts = [] as IPart[];
  for (let i = 0; i < (exam?.result?.parts.length ?? 0); i++) {
    const part = exam?.result?.parts?.[i];
    const startIdx =
      (parts[i - 1]?.startIdx ?? 0) + (parts[i - 1]?.questions.length ?? 0);
    if (part) {
      parts.push({
        ...part,
        startIdx,
        questions: part.questions.map(item => {
          return {
            ...item,
            answer: item.userAnswer,
          };
        }),
      });
    }
  }
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
        innerRef={instance => (formRef.current = (instance as any)!)}
        initialValues={{
          parts,
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="w-full flex  gap-8">
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {values.parts?.map((part, idx) => (
                <div
                  key={idx}
                  className="flex flex-col  bg-white p-4 border border-gray-200"
                >
                  <h2 className="font-bold mb-6">Phần {idx + 1}</h2>
                  {part?.questions.map((item, questionIdx) => (
                    <div key={questionIdx} className="flex flex-col gap-6 pt-6">
                      <DoQuestion
                        id={item.id}
                        answer={item.answer}
                        onChange={answer =>
                          setFieldValue(
                            `parts[${idx}].questions[${questionIdx}].answer`,
                            answer,
                          )
                        }
                        showAnswer={hasSaveSession}
                        question={item}
                        idx={(part.startIdx ?? 0) + questionIdx + 1}
                      />
                      <div className="h-[1px] w-full bg-gray-400"></div>
                    </div>
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
                        handleSubmit();
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
                {hasSaveSession && (
                  <button
                    className="btn !bg-primary-50 w-full"
                    type="button"
                    onClick={() => {
                      setSubmitModal({ show: true, hasSaveSession: true });
                    }}
                  >
                    Lưu phiên thi
                  </button>
                )}
              </div>
              <div className=" flex-1 overflow-y-auto w-full border border-gray-200 bg-white p-4 rounded-md ">
                {values.parts?.map((part, idx) => (
                  <div key={idx} className="mb-4">
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
                          {(part.startIdx ?? 0) + idx + 1}
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
                setSubmitModal({ show: false, hasSaveSession: true });
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
                    : 'Hoàn thành bài thi'
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
