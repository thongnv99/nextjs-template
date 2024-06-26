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
import Plus from 'assets/svg/plus-circle.svg';
import QuestionPicker from 'components/QuestionPicker';
import { METHOD } from 'global';
import { uuid } from 'utils/common';
import TextInput from 'elements/TextInput';
import Close from 'assets/svg/x-circle.svg';
import ContestForm from 'components/ContestForm';
import { useDrop } from 'react-dnd';
import QuestionDnd from './QestionDnd';
import ExamPicker from 'components/ExamPicker';
import SelectExamForm from './SelectExamForm';
import { useTranslation } from 'app/i18n/client';
interface ExamConfigProps {
  examId: string;
  isContest?: boolean;
}

interface ExamConfigValues {
  parts: IPart[];
  duration?: number;
  order?: number;
}

const ExamConfig = (props: ExamConfigProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { lng } = useParams();
  const componentId = useRef(uuid());
  const [modalCopy, setModalCopy] = useState<{ show: boolean }>();
  const formRef = useRef<FormikProps<ExamConfigValues>>();
  const [, drop] = useDrop(() => ({ accept: 'QuestionDnd' }));
  const [titleModal, setTitleModal] = useState(false);
  const [questionModal, setQuestionModal] = useState<{
    show: boolean;
    currentPart?: number;
  }>({ show: false });

  const { trigger } = useMutation<IExam>('exam/copy/detail', {
    url: '/api/v1/{source}/{examId}',
    method: METHOD.GET,
    loading: true,
    componentId: componentId.current,
    onSuccess(data) {
      if (data) {
        formRef.current?.setValues({
          parts: data.parts ?? [],
          duration: (data.duration ?? 0) / 60,
          order: data.order,
        });
      }
    },
  });

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
        title: props.isContest ? 'J_166' : 'J_167',
        content: props.isContest ? 'J_168' : 'J_169',
      },
      onSuccess() {
        router.push(`/${lng}/${props.isContest ? 'contest' : 'exam'}`);
      },
    },
  );

  const handleSubmit = (values: ExamConfigValues) => {
    updateExam({
      examId: props.examId,
      parts: values.parts.map(part => ({
        duration: part.duration,
        questions: part.questions.map(item => item.id),
        name: part.name,
      })),
      duration: Number(values.duration ?? 0) * 60,
      order: Number(values.order),
    });
  };

  const handleSelectQuestion = (questions: IQuestion[]) => {
    const idx = questionModal.currentPart;
    if (idx != null && idx >= 0) {
      const part = formRef.current?.values.parts?.[idx];
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
    <Loader id={componentId.current} className="h-full w-full flex flex-col ">
      <div className="px-0 pb-6 flex items-center justify-between sticky top-[-40px] pt-4 bg-[#F9FAFB]">
        <div className="text-lg font-semibold flex gap-1 items-center">
          <div
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              router.push(`/${lng}/${props.isContest ? 'contest' : 'exam'}`);
            }}
          >
            {t(props.isContest ? 'J_2' : 'J_1')}
          </div>
          <ArrowRight />
          <div className="flex">
            {exam.title}
            <Edit
              onClick={() => setTitleModal(true)}
              className="ml-2 text-gray-500 hover:text-gray-900 cursor-pointer w-4 h-4"
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => formRef.current?.submitForm()}
        >
          {t('J_156')}
        </button>
      </div>
      <div>
        <Formik
          onSubmit={handleSubmit}
          innerRef={instance => (formRef.current = instance!)}
          initialValues={
            {
              parts: exam.parts ?? [],
              duration: (exam.duration ?? 0) / 60,
              order: exam.order,
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
              <div className="border rounded-2xl transition-all p-2 md:p-6  bg-white flex flex-col gap-2 md:gap-4">
                <TextInput
                  label="Thời gian (phút)"
                  name={`duration`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.duration}
                  type="number"
                />
                <TextInput
                  label="Thứ tự"
                  name={`order`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.order}
                  type="number"
                />
              </div>
              {values.parts.map((part, idx) => (
                <div
                  key={idx}
                  className="border rounded-2xl transition-all p-2 md:p-6 flex flex-col gap-2 md:gap-4 bg-white"
                >
                  <div className=" flex flex-col  ">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-lg">
                        {t('J_115', { idx: idx + 1 })}
                      </div>

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
                  <div>
                    <TextInput
                      label="Tên"
                      name={`parts[${idx}].name`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={part.name}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-4">
                    <div>
                      <div className="flex w-full items-center justify-between">
                        <div>{t('J_170')}</div>
                        <button
                          type="button"
                          className="btn !border-primary-500 btn-icon !text-primary-500"
                          onClick={() =>
                            setQuestionModal({ show: true, currentPart: idx })
                          }
                        >
                          <Plus /> {t('J_171')}
                        </button>
                      </div>
                      <div className="p-2 md:p-6  flex flex-col gap-4">
                        {part.questions.map((question, questionIdx) => (
                          <QuestionDnd
                            key={question.id}
                            data={question}
                            idx={questionIdx}
                            findItem={id =>
                              part.questions.findIndex(item => item.id === id)
                            }
                            onMove={(fromIdx, toIdx) => {
                              const fromValue = { ...part.questions[fromIdx] };
                              const copy = [...part.questions];
                              copy.splice(fromIdx, 1); // xóa phần tử from
                              copy.splice(toIdx, 0, fromValue); //chèn phần  tử from vào toIdx
                              setFieldValue(`parts[${idx}].questions`, copy);
                            }}
                            onDelete={() => {
                              setFieldValue(
                                `parts[${idx}].questions`,
                                part.questions.filter(
                                  item => item.id !== question.id,
                                ),
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-full flex justify-center my-8 gap-8">
                {values.parts.length === 0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalCopy({ show: true });
                    }}
                  >
                    {t('J_172')}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-icon !bg-white"
                  onClick={() => {
                    setFieldValue('parts', [
                      ...values.parts,
                      { duration: 0, questions: [] },
                    ]);
                  }}
                >
                  <Plus /> {t('J_173')}
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
      <ModalProvider
        show={modalCopy?.show || false}
        onClose={() => setModalCopy({ show: false })}
      >
        <SelectExamForm
          onClose={() => setModalCopy({ show: false })}
          onSelect={(exam, contest) => {
            if (exam) {
              setModalCopy({ show: false });
              trigger({ examId: exam.id, source: 'exams' });
            } else if (contest) {
              setModalCopy({ show: false });
              trigger({ examId: contest.id, source: 'contests' });
            }
          }}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ExamConfig;
