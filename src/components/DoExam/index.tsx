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

const DoExam = (props: { examId: string; isContest?: boolean }) => {
  const [modalNext, setModalNext] = useState(false);
  const router = useRouter();
  const { lng } = useParams();
  const search = useSearchParams();
  const hasSaveSession = search.get('has-save-session') === 'true';
  const [expModal, setExpModal] = useState(false);

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
      onSuccess() {
        console.log('success', timerController.current);
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
          }
        : {
            source: 'EXAM',
            examId: props.examId,
          },
    );
  }, [props.examId, trigger]);

  const handleSubmit = (values: { parts: IPart[] | undefined }) => {
    submitExam({
      sessionId: exam?.result?.sessionId,
      answersByPart: values.parts?.map((part, idx) => ({
        part: idx,
        answers: part.questions.map(question => question.answer ?? ''),
      })),
    });
  };
  if (isMutating) {
    return <Preload />;
  }

  if (result) {
    const resultData = result.result;
    return (
      <div className=" w-full max-w-screen-lg rounded-md border border-gray-200 m-auto bg-white">
        <h1 className="text-center text-[3rem]">Kết quả</h1>
        <div className="flex">
          <div className="mb-8  p-4 flex flex-col gap-4">
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Tên đề thi</div>
              <div>{examData?.title}</div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian bắt đầu
              </div>
              <div>
                {resultData?.startTime
                  ? formatDateToString(
                      new Date(resultData?.startTime),
                      'HH:mm:ss dd/MM/yyyy',
                    )
                  : '--'}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian kết thúc
              </div>
              <div>
                {resultData?.endTime
                  ? formatDateToString(
                      new Date(resultData?.endTime),
                      'HH:mm:ss dd/MM/yyyy',
                    )
                  : '--'}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian làm bài
              </div>
              <div>
                {resultData?.startTime && resultData?.endTime
                  ? `${differenceInMinutes(
                      resultData.endTime,
                      resultData.startTime,
                    )} phút`
                  : ''}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Đáp án đúng</div>
              {resultData?.status === 'FINISHED' ? (
                <div>
                  <strong className="text-primary-900">
                    {resultData.statAnswer?.totalCorrect}
                  </strong>
                  /{resultData.statAnswer?.total}
                </div>
              ) : (
                <div>Bài thi cần thời gian để xử lý!</div>
              )}
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Điểm</div>
              {resultData?.status === 'FINISHED' ? (
                <div>
                  <strong className="text-primary-900">
                    {resultData.statScore?.totalCorrect}
                  </strong>
                  /{resultData.statScore?.total}
                </div>
              ) : (
                <div>Bài thi cần thời gian để xử lý!</div>
              )}
            </div>
            <div className="flex w-full justify-center">
              <button
                type="button"
                className="btn-primary mt-5 w-fit"
                onClick={() => {
                  router.push(`/${lng}/exam`);
                }}
              >
                Đồng ý
              </button>
            </div>
          </div>
          <div>
            <PercentChart
              options={{
                size: 90,
                borderWidth: 20,
                percent: 10,
                padding: 0,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const checkQuestionFinished = (question: IQuestion) => {
    if (question.type !== QUESTION_TYPE.FILL_IN_THE_BLANK) {
      return !isBlank(question.answer as string);
    }

    return (question.answer as string[])?.every(item => !isBlank(item));
  };

  return (
    <Loader id={componentId.current} className=" w-full max-w-screen-lg m-auto">
      <div className="mb-8">
        <h1 className="text-center text-[3rem]">{examData?.title}</h1>
      </div>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          parts: exam?.result?.parts,
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="w-full flex  gap-8">
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {values.parts?.map((part, idx) => (
                <div key={idx} className="flex flex-col gap-4">
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
            <div className="min-w-[30rem] border border-gray-200 p-4 rounded-md h-fit sticky top-0 right-0 bg-white">
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
              <button className="btn-primary w-full mb-8" type="submit">
                Nộp bài
              </button>

              {values.parts?.map((part, idx) => (
                <div key={idx}>
                  <h2 className="text-[2rem] mb-2">Phần {idx + 1}</h2>
                  <div className="grid grid-cols-4 gap-4">
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
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default DoExam;
