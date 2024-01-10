import { Disclosure, Transition } from '@headlessui/react';
import React, { useEffect } from 'react';
import Trash from 'assets/svg/trash.svg';
import Edit from 'assets/svg/edit.svg';
import Copy from 'assets/svg/copy.svg';
import Chevron from 'assets/svg/chevron-down.svg';
import { IQuestion } from 'interfaces';
import { QUESTION_TYPE } from 'global';
import { formatNumber } from 'utils/common';
import { formatDateToString } from 'utils/datetime';

type Props = { data: IQuestion };

const mapQuestionType = {
  [QUESTION_TYPE.ESSAY]: 'Tự luận',
  [QUESTION_TYPE.MULTIPLE_CHOICE]: 'Trắc nghiệm',
  [QUESTION_TYPE.FILL_IN_THE_BLANK]: 'Điền vào chỗ trống',
};

const QuestionItem = (props: Props) => {
  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('edit');
  };
  const handleCopy = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('copy');
  };
  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('delete');
  };

  return (
    <Disclosure>
      {({ open }) => {
        return (
          <div className="w-full flex flex-col">
            <Disclosure.Button>
              <div className="flex items-center justify-between p-4 rounded-lg border transition duration-75 border-gray-200 shadow-sm">
                <div className="flex flex-col justify-between items-start">
                  <div
                    className="text-base text-left text-gray-900 font-semibold"
                    dangerouslySetInnerHTML={{ __html: props.data.content }}
                  ></div>
                  <div className="text-sm text-gray-500 font-normal">
                    Up to 10 users and 20GB individual data.
                  </div>
                </div>
                <div className="flex gap-8">
                  <Edit onClick={handleEdit} />
                  <Copy onClick={handleCopy} />
                  <Trash onClick={handleDelete} />
                  <Chevron
                    className={`${
                      open ? 'rotate-180' : ''
                    } transform transition duration-75`}
                  />
                </div>
              </div>
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition-all duration-100 ease-out"
              enterFrom="transform h-0 opacity-0"
              enterTo="transform h-[14rem] opacity-100"
              leave="transition-all duration-100 ease-out"
              leaveFrom="transform h-[14rem] opacity-100"
              leaveTo="transform h-0 opacity-0"
              className="overflow-hidden "
            >
              <Disclosure.Panel static>
                <div className="p-4">
                  <div className="font-semibold mb-3">Thông tin câu hỏi</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">Loại</div>
                      <div className="font-normal text-sm text-gray-500">
                        {mapQuestionType[props.data.type]}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">Điểm</div>
                      <div className="font-normal text-sm text-gray-500">
                        {formatNumber(props.data.score ?? 1)}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">
                        Ngày tạo
                      </div>
                      <div className="font-normal text-sm text-gray-500">
                        {formatDateToString(
                          new Date(props.data.createdAt),
                          'dd/MM/yyyy HH:mm:ss',
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        );
      }}
    </Disclosure>
  );
};

export default QuestionItem;