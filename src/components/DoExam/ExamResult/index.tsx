'use client';
import PercentChart from 'components/PercentChart';
import { differenceInMinutes } from 'date-fns';
import { IExam, IPart, SubmitExamRes } from 'interfaces';
import Chevron from 'assets/svg/chevron-down.svg';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { formatDateToString } from 'utils/datetime';
import DoQuestion from '../DoQuestion';
import { Disclosure, Transition } from '@headlessui/react';
import ArrowRight from 'assets/svg/arrow-right.svg';
import { QUESTION_STATUS_TRANSLATE } from 'global/translate';

type Props = {
  data?: SubmitExamRes;
  exam?: IExam;
  isContest?: boolean;
};

const ExamResult = ({ data, exam, isContest }: Props) => {
  const { lng } = useParams();
  const router = useRouter();
  const parts = JSON.parse(data?.parts as string) as IPart[];
  return (
    <div>
      <div className=" w-full p-4  rounded-md border border-gray-200 m-auto bg-white">
        <h1 className="text-center text-[3rem]">Kết quả</h1>
        <div className="flex w-full justify-between">
          <div className="mb-8  p-4 flex flex-col gap-4 flex-1">
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Tên đề thi</div>
              <div>{exam?.title}</div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian bắt đầu
              </div>
              <div>
                {data?.startTime
                  ? formatDateToString(
                      new Date(data?.startTime),
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
                {data?.endTime
                  ? formatDateToString(
                      new Date(data?.endTime),
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
                {data?.startTime && data?.endTime
                  ? `${differenceInMinutes(data.endTime, data.startTime)} phút`
                  : ''}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Đáp án đúng</div>
              {data?.status === 'FINISHED' ? (
                <div>
                  <strong className="text-primary-900">
                    {data.statAnswer?.totalCorrect}
                  </strong>
                  /{data.statAnswer?.total}
                </div>
              ) : (
                <div>Bài thi cần thời gian để xử lý!</div>
              )}
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Điểm</div>
              {data?.status === 'FINISHED' ? (
                <div>
                  <strong className="text-primary-900">
                    {data.statScore?.totalCorrect}
                  </strong>
                  /{data.statScore?.total}
                </div>
              ) : (
                <div>Bài thi cần thời gian để xử lý!</div>
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <PercentChart
              options={{
                size: 90,
                borderWidth: 20,
                total: data?.statAnswer?.total ?? 0,
                value: data?.statAnswer?.totalCorrect ?? 0,
                padding: 0,
                label: 'Đáp án đúng',
              }}
            />
          </div>
        </div>
        <div className="flex w-full justify-center gap-8">
          <button
            type="button"
            className="btn mt-5 w-fit"
            onClick={() => {
              router.push(
                `/${lng}/${isContest ? 'contest' : 'exam'}/history/${exam?.id}`,
              );
            }}
          >
            Lịch sử thi
          </button>
          <button
            type="button"
            className="btn-primary mt-5 w-fit"
            onClick={() => {
              router.push(`/${lng}/${isContest ? 'contest' : 'exam'}`);
            }}
          >
            Đồng ý
          </button>
        </div>
      </div>
      <div className="gap-4 mt-4 p-4 bg-white  border border-gray-200">
        <Disclosure>
          {({ open }) => {
            return (
              <div className="w-full flex flex-col question-item">
                <Disclosure.Button>
                  <div className="flex items-center justify-between transition duration-75 ">
                    <div className="flex  justify-between items-start">
                      <div className="text-base text-left text-gray-900 font-semibold">
                        {' '}
                        Chi tiết
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <Chevron
                        className={`${
                          open ? 'rotate-180' : ''
                        } w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transform transition duration-75`}
                      />
                    </div>
                  </div>
                </Disclosure.Button>
                <Transition
                  show={open}
                  enter="transition-all duration-100 ease-out"
                  enterFrom="transform h-0 opacity-0"
                  enterTo="transform  opacity-100"
                  leave="transition-all duration-100 ease-out"
                  leaveFrom="transform  opacity-100"
                  leaveTo="transform h-0 opacity-0"
                  className="overflow-hidden "
                >
                  <Disclosure.Panel static>
                    <div className="p-4">
                      {parts?.map((part, idx) => (
                        <div key={idx} className="flex flex-col ">
                          <h2 className="font-bold">Phần {idx + 1}</h2>
                          {part?.questions.map((question, questionIdx) => {
                            console.log({
                              corr: question.correctOption,
                              user: question.userAnswer,
                            });
                            return (
                              <div
                                key={questionIdx}
                                className=" px-4 py-8 bg-white border-b border-b-gray-400"
                              >
                                <div className="flex mb-4 gap-4">
                                  <div className="whitespace-nowrap">
                                    Câu {questionIdx + 1}:
                                  </div>
                                  <div
                                    className="font-bold"
                                    dangerouslySetInnerHTML={{
                                      __html: question?.content ?? '',
                                    }}
                                  ></div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {question.options?.map(
                                    (option, optionIdx) => (
                                      <div
                                        className={`flex gap-4 items-center  p-2 rounded-sm
                          ${
                            String(question.userAnswer).includes(
                              String(optionIdx),
                            ) &&
                            !question.correctOption?.includes(String(optionIdx))
                              ? 'bg-red-200'
                              : ''
                          } 
                          ${
                            question.correctOption?.includes(String(optionIdx))
                              ? 'bg-green-200'
                              : ''
                          }`}
                                        key={optionIdx}
                                      >
                                        <div>{optionIdx + 1}:</div>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: option,
                                          }}
                                        ></div>
                                      </div>
                                    ),
                                  )}
                                </div>
                                <div className="mt-4">
                                  <Disclosure>
                                    {({ open }) => {
                                      return (
                                        <div className="w-full flex flex-col question-item">
                                          <Disclosure.Button>
                                            <div className="flex items-center justify-between transition duration-75 bg-primary-200">
                                              <div className="  p-2 flex gap-2 items-center">
                                                Đáp án đúng:{' '}
                                                <strong>
                                                  {String(
                                                    question!.correctOption,
                                                  )
                                                    ?.split(',')
                                                    .map(
                                                      item => Number(item) + 1,
                                                    )
                                                    .join(', ')}
                                                </strong>
                                                <ArrowRight />
                                                <strong className="uppercase">
                                                  {
                                                    QUESTION_STATUS_TRANSLATE[
                                                      question.status
                                                    ]
                                                  }
                                                </strong>
                                              </div>
                                              {question.answerExplain && (
                                                <div className="flex gap-8">
                                                  <Chevron
                                                    className={`${
                                                      open ? 'rotate-180' : ''
                                                    } w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transform transition duration-75`}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </Disclosure.Button>
                                          <Transition
                                            show={open}
                                            enter="transition-all duration-100 ease-out"
                                            enterFrom="transform h-0 opacity-0"
                                            enterTo="transform  opacity-100"
                                            leave="transition-all duration-100 ease-out"
                                            leaveFrom="transform  opacity-100"
                                            leaveTo="transform h-0 opacity-0"
                                            className="overflow-hidden "
                                          >
                                            <Disclosure.Panel static>
                                              {question.answerExplain && (
                                                <div className="p-2 bg-primary-50">
                                                  <div>Giải thích đáp án</div>
                                                  <div
                                                    dangerouslySetInnerHTML={{
                                                      __html:
                                                        question.answerExplain ??
                                                        '',
                                                    }}
                                                  ></div>
                                                </div>
                                              )}
                                            </Disclosure.Panel>
                                          </Transition>
                                        </div>
                                      );
                                    }}
                                  </Disclosure>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            );
          }}
        </Disclosure>
      </div>
    </div>
  );
};

export default ExamResult;
