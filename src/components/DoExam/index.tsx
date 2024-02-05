'use client';
import React, { useEffect, useRef, useState } from 'react';
import DoQuestion from './DoQuestion';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { DoExamRes, IExam, IPart, SubmitExamRes } from 'interfaces';
import { METHOD } from 'global';
import TimeViewer, { TimeViewerHandle } from 'components/TimeViewer';
import Preload from 'components/Preload';
import { Formik } from 'formik';
import { isBlank, uuid } from 'utils/common';
import Loader from 'components/Loader';
import { formatDateToString } from 'utils/datetime';
import { useParams, useRouter } from 'next/navigation';

const DoExam = (props: { examId: string }) => {
  const router = useRouter();
  const { lng } = useParams();
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
        answers: part.questions.map(question => question.answer),
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
            </div>
            <div className="min-w-[30rem] border border-gray-200 p-4 rounded-md ">
              <div className="w-full mb-4">
                <TimeViewer ref={timerController} />
              </div>
              <button className="btn-primary w-full mb-8" type="submit">
                Nộp bài
              </button>

              <div>
                <h2 className="text-[2rem] mb-2">
                  Phần {values.currentPart + 1}
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {values.parts?.[values.currentPart]?.questions.map(
                    (item, idx) => (
                      <div
                        className={` border ${
                          !isBlank(item.answer) ? 'bg-gray-200' : ''
                        } aspect-square border-gray-200 w-full flex items-center justify-center rounded-[50%]`}
                        key={idx}
                      >
                        {idx + 1}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default DoExam;
