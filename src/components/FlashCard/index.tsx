'use client';
import Loader from 'components/Loader';
import { FLASH_CARD_STATUS, METHOD } from 'global';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import FlashCardItem from './FlashCardItem';
import Plus from 'assets/svg/plus.svg';
import ModalProvider from 'components/ModalProvider';
import FlashCardForm from './FlashCardForm';
import { FLASH_CARD_QUERY_LIST } from 'store/key';
import Dropdown from 'elements/Dropdown';
import { useFlashCard } from 'hooks/common';
import FlashCardViewer from 'components/FlashCardViewer';
import Preload from 'components/Preload';
import { Transition } from '@headlessui/react';
import ChevronLeft from 'assets/svg/chevron-left.svg';
import CloseIcon from 'assets/svg/x.svg';

type Props = {};

const FlashCardStatusOptions = [
  {
    label: 'Tất cả',
    value: '',
  },
  {
    label: 'Chưa thuộc',
    value: FLASH_CARD_STATUS.UNLEARNED,
  },
  {
    label: 'Đã thuộc',
    value: FLASH_CARD_STATUS.LEARNED,
  },
];

const FlashCard = (props: Props) => {
  const componentId = useRef(uuid());
  const [createModal, setCreateModal] = useState(false);
  const [delaySlider, setDelaySlider] = useState(false);
  const [viewModal, setViewModal] = useState({ show: false, currentIdx: 0 });
  const [status, setStatus] = useState('');
  const { data, isLoading, mutate } = useFlashCard(status);
  const timer = useRef<NodeJS.Timeout>();

  const handleCreateClick = () => {
    setCreateModal(true);
  };

  useEffect(() => {
    if (viewModal.show) {
      timer.current = setTimeout(() => {
        setDelaySlider(true);
      }, 500);
    } else {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setDelaySlider(false);
    }
  }, [viewModal]);

  return (
    <Loader
      id={componentId.current}
      loading={isLoading}
      className="h-full w-full border border-gray-200 rounded-lg flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex justify-between ">
        <div className="text-lg font-semibold h-full flex items-center">
          Flashcard
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Dropdown
              selected={status}
              options={FlashCardStatusOptions}
              onChange={value => {
                setStatus(value);
              }}
            />
          </div>
          <button
            type="button"
            className="btn-primary btn-icon !h-full"
            onClick={handleCreateClick}
          >
            <Plus />{' '}
            <span className="md:inline-block hidden">Thêm flashcard</span>
          </button>
        </div>
      </div>
      {data?.items.length ? (
        <div className="p-5 flex-1 grid grid-col-1 md:grid-col-2 lg:grid-cols-4  gap-4 overflow-y-auto">
          {data?.items.map((item, idx) => (
            <FlashCardItem
              data={item}
              key={item.id}
              onView={() => {
                setViewModal({ show: true, currentIdx: idx });
              }}
              onRefresh={() => {
                mutate();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="text-lg font-bold text-gray-900 mb-1">
            Không tìm thấy dữ liệu
          </div>
          <div className="text-sm font-normal text-gray-500 mb-6 ">
            Bạn chưa có flash card nào , tạo mới ngay!
          </div>
          <button
            type="button"
            className="btn-primary btn-icon"
            onClick={handleCreateClick}
          >
            <Plus /> Thêm flashcard
          </button>
        </div>
      )}

      <ModalProvider show={createModal}>
        <FlashCardForm
          onClose={() => setCreateModal(false)}
          onRefresh={() => {
            mutate();
          }}
        />
      </ModalProvider>
      <Transition
        show={viewModal.show}
        appear
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0"
        className="fixed ease-out duration-300 top-0 left-0 right-0 bottom-0 z-20 flex flex-col bg-gray-500 p-10"
      >
        <div className=" flex gap-2  items-center justify-between  text-lg font-semibold text-white cursor-pointer">
          flashcard
          <CloseIcon
            onClick={() => setViewModal({ show: false, currentIdx: 0 })}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`w-fit  p-2 transform  rounded-2xl overflow-visible bg-white text-left align-middle shadow-xl transition-all`}
          >
            <FlashCardViewer
              flashCards={data?.items ?? []}
              currentIdx={viewModal.currentIdx}
            />
          </div>
        </div>
      </Transition>
    </Loader>
  );
};

export default FlashCard;
