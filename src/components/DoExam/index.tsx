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
import { useParams, useRouter } from 'next/navigation';
import ModalProvider from 'components/ModalProvider';
import ConfirmModal from 'components/ConfirmModal';

const DoExam = (props: { examId: string }) => {
  const [modalNext, setModalNext] = useState(false);
  const router = useRouter();
  const { lng } = useParams();
  const [expModal, setExpModal] = useState(false);
  const { data: examData } = useSWRWrapper<IExam>(
    `/api/v1/exams/${props.examId}`,
    {
      url: `/api/v1/exams/${props.examId}`,
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
    trigger({
      source: 'EXAM',
      examId: props.examId,
    });
  }, [props.examId, trigger]);

  console.log({ exam });

  const handleSubmit = (values: {
    parts: IPart[] | undefined;
    currentPart: number;
  }) => {
    console.log(values);
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
    return (
      <div className=" w-full max-w-screen-lg m-auto">
        <h1 className="text-center text-[3rem]">Kết quả</h1>
        <div className="mb-8 rounded-md border border-gray-200 p-4 flex flex-col gap-4">
          <div className="flex">
            <div className="min-w-[20rem] text-gray-500">Tên đề thi</div>
            <div>{examData?.title}</div>
          </div>
          <div className="flex">
            <div className="min-w-[20rem] text-gray-500">Thời gian bắt đầu</div>
            <div>
              {result?.result?.startTime
                ? formatDateToString(new Date(result?.result?.startTime))
                : '--'}
            </div>
          </div>
          <div className="flex">
            <div className="min-w-[20rem] text-gray-500">
              Thời gian kết thúc
            </div>
            <div>
              {result?.result?.endTime
                ? formatDateToString(new Date(result?.result?.endTime))
                : '--'}
            </div>
          </div>
          <div className="flex">
            <div className="min-w-[20rem] text-gray-500">Điểm</div>
            <div>Bài thi cần thời gian để xử lý!</div>
          </div>
          <div className="flex w-full justify-center">
            <button
              type="button"
              className="btn-primary mt-5 w-fit"
              onClick={() => {
                router.push(`/${lng}/customer/exam`);
              }}
            >
              Đồng ý
            </button>
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
          currentPart: 0,
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="w-full flex  gap-8">
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {values.parts?.[values.currentPart]?.questions.map(
                (item, idx) => (
                  <DoQuestion
                    answer={item.answer}
                    onChange={answer =>
                      setFieldValue(
                        `parts[${values.currentPart}].questions[${idx}].answer`,
                        answer,
                      )
                    }
                    key={idx}
                    question={item}
                    idx={idx + 1}
                  />
                ),
              )}

              {values.currentPart < (values.parts?.length ?? 0) - 1 && (
                <div className="w-full flex justify-center">
                  <button
                    className="btn"
                    type="button"
                    disabled={
                      values.currentPart + 1 > (values.parts?.length ?? 0)
                    }
                    onClick={() => {
                      if (
                        values.currentPart <=
                        (values.parts?.length ?? 0) - 1
                      ) {
                        setModalNext(true);
                      }
                    }}
                  >
                    Phần tiếp theo
                  </button>
                </div>
              )}
            </div>
            <div className="min-w-[30rem] border border-gray-200 p-4 rounded-md h-fit sticky top-0 right-0">
              <div className="w-full mb-4">
                <div>Thời gian còn lại</div>
                <TimeViewer
                  initTime={values.parts?.[values.currentPart]?.duration ?? 0}
                  ref={timerController}
                  onExp={() => {
                    setExpModal(true);
                  }}
                />
              </div>
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
                        } aspect-square border-gray-200 w-full flex items-center justify-center rounded-[50%]`}
                        key={idx}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <ModalProvider show={modalNext} onClose={() => setModalNext(false)}>
              <ConfirmModal
                onConfirm={() => {
                  timerController.current?.setTime(
                    values.parts?.[values.currentPart + 1]?.duration ?? 0,
                  );
                  timerController.current?.startCount();
                  setFieldValue('currentPart', values.currentPart + 1);
                  setModalNext(false);
                }}
                type="warning"
                onCancel={() => setModalNext(false)}
                title="Chuyển phần tiếp theo"
                content="Sau khi chuyển sang phần tiếp theo bạn sẽ không được quay lại. Bạn có muốn tiếp tục không?"
              />
            </ModalProvider>
            <ModalProvider show={expModal} onClose={() => {}}>
              <ConfirmModal
                onConfirm={() => {
                  if (values.currentPart < (values.parts?.length ?? 0) - 1) {
                    timerController.current?.setTime(
                      values.parts?.[values.currentPart + 1]?.duration ?? 0,
                    );
                    timerController.current?.startCount();
                    setFieldValue('currentPart', values.currentPart + 1);
                    setExpModal(false);
                  } else {
                    handleSubmit();
                  }
                }}
                labelConfirm={
                  values.currentPart < (values.parts?.length ?? 0) - 1
                    ? 'Xác nhận'
                    : 'Nộp bài'
                }
                type="warning"
                title="Hết thời gian"
                content={
                  values.currentPart < (values.parts?.length ?? 0) - 1
                    ? `Thời gian làm bài phần ${values.currentPart + 1} đã hết`
                    : 'Thời gian làm bài đã hết'
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
