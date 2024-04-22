'use client';
import ArrowRight from 'assets/svg/arrow-right.svg';
import { Disclosure, Transition } from '@headlessui/react';
import { IPart } from 'interfaces';
import React from 'react';
import { QUESTION_STATUS_TRANSLATE } from 'global/translate';
import Chevron from 'assets/svg/chevron-down.svg';

type Props = {
  data: Record<string, unknown>;
  onClose(): void;
};

const ContestResult = (props: Props) => {
  const parts = props.data.parts as IPart[];
  return (
    <div className="w-screen max-w-screen-md ">
      <div className="w-full flex flex-col items-center p-4">
        <div>{`${(props.data.userId as any).firstName as string} ${
          (props.data.userId as any).lastName as string
        }`}</div>
      </div>
      <div className="max-h-[60vh] w-full overflow-y-auto">
        <div className="p-4">
          {parts?.map((part, idx) => (
            <div key={idx} className="flex flex-col ">
              <h2 className="font-bold">Phần {idx + 1}</h2>
              {part?.questions.map((question, questionIdx) => {
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
                      {question.options?.map((option, optionIdx) => (
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
                      ))}
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
                                      {String(question!.correctOption)
                                        ?.split(',')
                                        .map(item => Number(item) + 1)
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
                                          __html: question.answerExplain ?? '',
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
      </div>
      <div className="p-4 flex gap-8 items-center justify-center">
        <button onClick={props.onClose} className="btn" type="button">
          Hủy bỏ
        </button>
        <button className="btn-primary" type="button">
          Cập nhật điểm
        </button>
      </div>
    </div>
  );
};

export default ContestResult;