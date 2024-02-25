'use client';
import Loader from 'components/Loader';
import Preload from 'components/Preload';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { IContest, IExam, IPart, IQuestion } from 'interfaces';
import React, { useRef, useState } from 'react';
import ArrowRight from 'assets/svg/chevron-right.svg';
import Edit from 'assets/svg/edit-2.svg';
import { useParams, useRouter } from 'next/navigation';
import ModalProvider from 'components/ModalProvider';
import ExamForm from 'components/ExamForm';
import { Formik, FormikProps } from 'formik';
import Delete from 'assets/svg/delete.svg';
import Plus from 'assets/svg/plus-circle.svg';
import QuestionPicker from 'components/QuestionPicker';
import { METHOD } from 'global';
import { uuid } from 'utils/common';
import TextInput from 'elements/TextInput';
import Close from 'assets/svg/x-circle.svg';
import ContestForm from 'components/ContestForm';
interface ExamConfigProps {
  examId: string;
  isContest?: boolean;
}

interface ExamConfigValues {
  parts: IPart[];
}

const ExamConfig = (props: ExamConfigProps) => {
  const router = useRouter();
  const { lng } = useParams();
  const componentId = useRef(uuid());
  const formRef = useRef<FormikProps<ExamConfigValues>>();
  const [titleModal, setTitleModal] = useState(false);
  const [questionModal, setQuestionModal] = useState<{
    show: boolean;
    currentPart?: number;
  }>({ show: false });
  const {
    data: exam,
    isLoading,
    mutate,
  } = useSWRWrapper<IExam | IContest>(
    `/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`,
    {
      url: `/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`,
    },
  );

  const { trigger: updateExam } = useMutation(
    `/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`,
    {
      url: `/api/v1/${props.isContest ? 'contests' : 'exams'}/{examId}`,
      method: METHOD.PUT,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: props.isContest ? 'Cập nhật cuộc thi' : 'Cập nhật đề thi',
        content: props.isContest
          ? 'Cập nhật cuộc thi thành công.'
          : 'Cập nhật đề thi thành công.',
      },
      onSuccess() {
        router.push(`/${lng}/customer/${props.isContest ? 'contest' : 'exam'}`);
      },
    },
  );

  const handleSubmit = (values: ExamConfigValues) => {
    updateExam({
      examId: props.examId,
      parts: values.parts.map(part => ({
        duration: part.duration,
        questions: part.questions.map(item => item.id),
      })),
    });
  };

  const handleSelectQuestion = (questions: IQuestion[]) => {
    const idx = questionModal.currentPart;
    if (idx != null && idx >= 0) {
      const part = formRef.current?.values.parts?.[idx];
      console.log(part);
      if (part) {
        formRef.current?.setFieldValue(`parts[${idx}].questions`, [
          ...part.questions,
          ...questions,
        ]);
      }
    }
  };

  if (isLoading || !exam) {
    return <Preload />;
  }
  return (
    <Loader
      id={componentId.current}
      className="h-full w-full   max-w-screen-lg m-auto flex flex-col "
    >
      <div className="px-0 py-6 flex items-center justify-between">
        <div className="text-lg font-semibold flex gap-1 items-center">
          <div
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              router.push(`/${lng}/customer/exam`);
            }}
          >
            {props.isContest ? 'Cuộc thi' : 'Đề thi'}
          </div>
          <ArrowRight />
          <div className="flex">
            {exam.title}{' '}
            <Edit
              onClick={() => setTitleModal(true)}
              className="ml-2 text-gray-500 hover:text-gray-900 cursor-pointer w-4 h-4"
            />{' '}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => formRef.current?.submitForm()}
        >
          Lưu
        </button>
      </div>
      <div>
        <Formik
          onSubmit={handleSubmit}
          innerRef={instance => (formRef.current = instance!)}
          initialValues={
            {
              parts: exam.parts ?? [],
            } as ExamConfigValues
          }
        >
          {({
            values,
            setFieldValue,
            handleChange,
            handleBlur,
            errors,
            touched,
          }) => (
            <form className="flex flex-col gap-4">
              {values.parts.map((part, idx) => (
                <div
                  key={idx}
                  className="border rounded-2xl transition-all p-6  "
                >
                  <div className="mb-8 flex flex-col  ">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-lg">Phần {idx + 1}</div>
                      <div
                        data-tooltip-id="default-tooltip"
                        data-tooltip-content="Xóa phần thi"
                        className="cursor-pointer text-gray-700 hover:text-gray-900"
                        onClick={() => {
                          const arr = [...values.parts];
                          arr.splice(idx, 1);
                          setFieldValue('parts', arr);
                        }}
                      >
                        <Close />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-4">
                    <TextInput
                      label="Thời gian (phút)"
                      name={`parts[${idx}].duration`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={part.duration}
                      type="number"
                    />
                    <div>
                      <div className="flex w-full items-center justify-between">
                        <div>Danh sách câu hỏi</div>
                        <button
                          type="button"
                          className="btn !border-primary-500 btn-icon !text-primary-500"
                          onClick={() =>
                            setQuestionModal({ show: true, currentPart: idx })
                          }
                        >
                          <Plus /> Thêm câu hỏi
                        </button>
                      </div>
                      <div className="p-6  flex flex-col gap-4">
                        {part.questions.map(question => (
                          <div
                            key={question.id}
                            className="flex items-center border border-primary-400 rounded-[0.8rem] p-4 justify-between"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: question.content,
                              }}
                            ></div>
                            <div>
                              <Delete
                                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-900"
                                onClick={() => {
                                  setFieldValue(
                                    `parts[${idx}].questions`,
                                    part.questions.filter(
                                      item => item.id !== question.id,
                                    ),
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-full flex justify-center m-8">
                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={() => {
                    setFieldValue('parts', [
                      ...values.parts,
                      { duration: 0, questions: [] },
                    ]);
                  }}
                >
                  <Plus /> Thêm phần thi
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <ModalProvider show={titleModal} onClose={() => setTitleModal(false)}>
        {props.isContest ? (
          <ContestForm
            data={exam as IContest}
            onClose={() => setTitleModal(false)}
            onRefresh={mutate}
          />
        ) : (
          <ExamForm
            data={exam as IExam}
            onClose={() => setTitleModal(false)}
            onRefresh={mutate}
          />
        )}
      </ModalProvider>
      <ModalProvider
        show={questionModal.show}
        onClose={() => setQuestionModal({ show: false })}
      >
        <QuestionPicker
          onSelect={handleSelectQuestion}
          onClose={() => setQuestionModal({ show: false })}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ExamConfig;
