import { Disclosure, Transition } from '@headlessui/react';
import Badge from 'components/Badge';
import { QUESTION_TYPE } from 'global';
import { IQuestion } from 'interfaces';
import React from 'react';
import { formatNumber, isBlank } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import Chevron from 'assets/svg/chevron-down.svg';
import { useTranslation } from 'app/i18n/client';

type Props = { data: IQuestion; onClose(): void; feedback?: string };

const QuestionDetailModal = (props: Props) => {
  const { t } = useTranslation();
  const mapQuestionType = {
    [QUESTION_TYPE.ESSAY]: t('J_9'),
    [QUESTION_TYPE.MULTIPLE_CHOICE]: t('J_209'),
    [QUESTION_TYPE.FILL_IN_THE_BLANK]: t('J_10'),
  };
  const question = props.data;
  return (
    <div className="w-screen max-w-screen-sm md:max-w-screen-md py-[2.4rem] md:p-[2.4rem]">
      <div className="font-semibold mb-3 w-full text-center text-[2rem]">
        {props.feedback ? t('J_212') : t('J_213')}
      </div>
      <div className="p-2 px-4">
        <div className="flex flex-col gap-2">
          <div className="flex">
            <div className="min-w-[10rem] font-semibold">{t('J_210')}</div>
            <div className="font-normal text-sm text-gray-500">
              {mapQuestionType[props.data.type]}
            </div>
          </div>
          <div className="flex">
            <div className="min-w-[10rem] font-semibold">{t('J_119')}</div>
            <div className="font-normal text-sm text-gray-500">
              {formatNumber(props.data.score ?? 1)}
            </div>
          </div>
          <div className="flex">
            <div className="min-w-[10rem] font-semibold">{t('J_174')}</div>
            <div className="font-normal text-sm text-gray-500">
              {formatDateToString(
                new Date(props.data.createdAt),
                'dd/MM/yyyy HH:mm:ss',
              )}
            </div>
          </div>
          <div className="flex">
            <div className="min-w-[10rem] font-semibold">{t('J_211')}</div>
            <div className="flex flex-wrap gap-2">
              {props.data.tags
                ?.split('|')
                .map(
                  (tag, idx) =>
                    !isBlank(tag) && (
                      <Badge
                        key={idx}
                        content={tag ?? '--'}
                        className={`bg-red-100 text-red-500 text-[1rem]`}
                      />
                    ),
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="  px-4 min-w-[10rem] font-semibold">
        {props.feedback ? t('J_213') : t('J_83')}
      </div>

      <div className=" px-8 py-2 bg-white ">
        <div className="flex mb-4 gap-4">
          <div
            className="font-bold"
            dangerouslySetInnerHTML={{
              __html: question?.content ?? '',
            }}
          ></div>
        </div>
        <div className="flex flex-col gap-2">
          {question.options?.map((option, optionIdx) => {
            return (
              <div
                className={`flex gap-4 items-center  p-2 rounded-sm
                    ${
                      String(question.correctOption)?.includes(
                        String(optionIdx),
                      )
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
            );
          })}
        </div>
        <div className="mt-4">
          <Disclosure>
            {({ open }) => {
              return (
                <div className="w-full flex flex-col question-item">
                  <Disclosure.Button className={'outline-none'}>
                    <div className="flex items-center justify-between transition duration-75 bg-primary-200">
                      <div className="  p-2 flex gap-2 items-center">
                        {t('J_121')}{' '}
                        <strong>
                          {String(question!.correctOption)
                            ?.split(',')
                            .map(item => Number(item) + 1)
                            .join(', ')}
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
                          <div>{t('J_123')}</div>
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
      {props.feedback && (
        <>
          <div className="  px-4 min-w-[10rem] font-semibold">{t('J_186')}</div>
          <div className="  px-4 min-w-[10rem] font-normal">
            {props.feedback}
          </div>
        </>
      )}

      <div className="flex">
        <button
          className=" btn-primary mt-8 mx-auto"
          type="button"
          onClick={props.onClose}
        >
          {t('J_61')}
        </button>
      </div>
    </div>
  );
};

export default QuestionDetailModal;
