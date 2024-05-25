'use client';
import React, { useEffect, useRef, useState } from 'react';
import DoQuestion from './DoQuestion';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import {
  DoExamRes,
  IContest,
  IExam,
  IPart,
  IQuestion,
  SubmitExamRes,
} from 'interfaces';
import { METHOD, QUESTION_TYPE } from 'global';
import TimeViewer, { TimeViewerHandle } from 'components/TimeViewer';
import Preload from 'components/Preload';
import { Formik, FormikProps } from 'formik';
import { isBlank, uuid } from 'utils/common';
import Loader from 'components/Loader';
import ChevronDown from 'assets/svg/chevron-down.svg';
import ChevronUp from 'assets/svg/chevron-up.svg';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ModalProvider from 'components/ModalProvider';
import ConfirmModal from 'components/ConfirmModal';
import ExamResult from './ExamResult';
import TextInput from 'elements/TextInput';
import { useTranslation } from 'app/i18n/client';

const DoExam = (props: { examId: string; isContest?: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { lng } = useParams();
  const search = useSearchParams();
  const hasSaveSession = search.get('has-save-session') === 'true';
  const sessionId = search.get('session');
  const [expModal, setExpModal] = useState(false);
  const [expandTime, setExpandTime] = useState(window.innerWidth > 768);
  const [submitModal, setSubmitModal] = useState({
    show: false,
    hasSaveSession: false,
  });
  const [triggerShowAnswer, setTriggerShowAnswer] = useState({ show: false });
  const [modalPassword, setModalPassword] = useState(false);
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
  const { data: examData, isLoading: loadingDetail } = useSWRWrapper<
    IExam & IContest
  >(`/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`, {
    url: `/api/v1/${props.isContest ? 'contests' : 'exams'}/${props.examId}`,
  });
  const componentId = useRef(uuid());
  const {
    data: joinExamData,
    trigger: joinExam,
    isMutating,
    error: joinExamError,
  } = useMutation<DoExamRes>(`/api/v1/joinExam`, {
    url: `/api/v1/joinExam`,
    method: METHOD.POST,
    loading: true,
    componentId: componentId.current,
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
        title: 'J_149',
        content: 'J_150',
      },
      onSuccess(data) {
        if (data?.status === 'SESSION_PAUSE') {
          router.push(`/${lng}/exam/history/${examData?.id}`);
        }
        setSubmitModal({ show: false, hasSaveSession: hasSaveSession });
      },
    },
  );

  const timerController = useRef<TimeViewerHandle>();

  useEffect(() => {
    if (examData) {
      if (props.isContest) {
        if (examData.hasPassword) {
        } else {
          handleJoinExam();
        }
      } else {
        handleJoinExam();
      }
    }
  }, [examData]);

  const handleJoinExam = (password?: string) => {
    joinExam(
      props.isContest
        ? {
            source: 'CONTEST',
            contestId: props.examId,
            hasSaveSession: hasSaveSession,
            ...(!isBlank(password) && {
              password,
            }),
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
  };

  const onSubmit = (values: { parts: IPart[] | undefined }) => {
    submitExam({
      sessionId: joinExamData?.sessionId,
      answersByPart: values.parts?.map((part, idx) => ({
        part: idx,
        answers: part.questions.map(question =>
          question.answer != null
            ? Array.isArray(question.answer)
              ? question.answer.join(',')
              : String(question.answer)
            : '',
        ),
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

  if ((isMutating || loadingDetail) && !examData?.hasPassword) {
    return <Preload />;
  }
  if (examData?.hasPassword && (!joinExamData || joinExamError)) {
    return (
      <Loader
        id={componentId.current}
        className=" w-full max-w-screen-lg m-auto pb-6"
      >
        <div className="flex flex-col  bg-white p-4 border border-gray-200">
          <div>{t('J_111')}</div>
          <Formik
            onSubmit={(values: { password: string }) => {
              console.log(values);
              handleJoinExam(values.password);
            }}
            initialValues={{ password: '' }}
          >
            {({
              values,
              handleBlur,
              handleChange,
              handleSubmit,
              errors,
              touched,
            }) => {
              return (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center gap-4"
                >
                  {joinExamError && (
                    <div className="text-red-500">{t(joinExamError.code)}</div>
                  )}
                  <TextInput
                    label="J_112"
                    placeholder="J_111"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    hasError={touched.password && !isBlank(errors.password)}
                    errorMessage={errors.password}
                  />
                  <button className="btn-primary" type="submit">
                    {t('C_1')}
                  </button>
                </form>
              );
            }}
          </Formik>
        </div>
      </Loader>
    );
  }

  if (result && result?.status !== 'SESSION_PAUSE') {
    const resultData = result;
    return (
      <ExamResult
        isContest={props.isContest}
        exam={examData}
        data={resultData}
      />
    );
  }
  const parts = [] as IPart[];
  for (let i = 0; i < (joinExamData?.parts.length ?? 0); i++) {
    const part = joinExamData?.parts?.[i];
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
      <div className=" md:block hidden mb-8">
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
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col-reverse md:flex-row gap-2 md:gap-8"
          >
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {values.parts?.map((part, idx) => (
                <div
                  key={idx}
                  className="flex flex-col  bg-white p-4 border border-gray-200"
                >
                  <h2 className="font-bold mb-6">{`Phần ${idx + 1}: ${
                    part.name ?? ''
                  }`}</h2>
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
                        triggerShowAnswer={triggerShowAnswer}
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
            <div className=" md:min-w-[30rem] sticky md:h-screen pb-2 md:pb-[12rem] top-0 right-0  flex flex-col gap-4">
              <div className=" w-full border border-gray-200 bg-white p-2 md:p-4 rounded-md flex flex-col ">
                {!hasSaveSession && (
                  <div className="w-full mb-2 md:mb-4 relative">
                    <div className="md:block hidden">{t('J_151')}</div>
                    {expandTime && (
                      <div className=" md:hidden  flex gap-2">
                        <h1 className="text-center text-[1.4rem] md:text-[3rem]">
                          {examData?.title}
                        </h1>
                        <div
                          className="block md:hidden  p-2 border border-slate-100"
                          onClick={() => {
                            setExpandTime(!expandTime);
                          }}
                        >
                          {!expandTime ? <ChevronDown /> : <ChevronUp />}
                        </div>
                      </div>
                    )}

                    <TimeViewer
                      initTime={(examData?.duration ?? 0) / 60}
                      ref={timerController}
                      onExp={() => {
                        handleSubmit();
                      }}
                    />
                  </div>
                )}
                {hasSaveSession && (
                  <div className="  md:hidden  flex gap-2">
                    <h1 className="text-center text-[1.4rem] md:text-[3rem]">
                      {examData?.title}
                    </h1>
                    <div
                      className="block md:hidden  p-2 border border-slate-100"
                      onClick={() => {
                        setExpandTime(!expandTime);
                      }}
                    >
                      {!expandTime ? <ChevronDown /> : <ChevronUp />}
                    </div>
                  </div>
                )}

                {expandTime && (
                  <button
                    className="btn-primary w-full my-2"
                    type="button"
                    onClick={() => {
                      setSubmitModal({ show: true, hasSaveSession: false });
                    }}
                  >
                    {t('J_149')}
                  </button>
                )}

                {hasSaveSession && expandTime && (
                  <>
                    <button
                      className="btn !bg-primary-50 w-full"
                      type="button"
                      onClick={() => {
                        setSubmitModal({ show: true, hasSaveSession: true });
                      }}
                    >
                      {t('J_152')}
                    </button>
                    <button
                      className="btn !bg-primary-50  w-full mt-2"
                      type="button"
                      onClick={() =>
                        setTriggerShowAnswer({ show: !triggerShowAnswer.show })
                      }
                    >
                      {t('J_153')}
                    </button>
                  </>
                )}
              </div>
              {expandTime && (
                <div className=" max-h-[70vh] flex-1 overflow-y-auto w-full border border-gray-200 bg-white p-4 rounded-md ">
                  {values.parts?.map((part, idx) => (
                    <div key={idx} className="mb-4">
                      <h2 className="text-[2rem] mb-2">
                        {t('J_115', { idx: idx + 1 })}
                      </h2>
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
              )}
            </div>
            <ModalProvider show={expModal} onClose={() => {}}>
              <ConfirmModal
                onConfirm={() => {
                  handleSubmit();
                }}
                labelConfirm={'J_149'}
                type="warning"
                title="J_154"
                content={'J_155'}
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
                labelConfirm={submitModal.hasSaveSession ? 'J_156' : 'J_149'}
                type="success"
                title={submitModal.hasSaveSession ? 'J_157' : 'J_158'}
                content={submitModal.hasSaveSession ? 'J_159' : 'J_160'}
              />
            </ModalProvider>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default DoExam;
