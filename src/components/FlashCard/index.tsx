'use client';
import Loader from 'components/Loader';
import { FLASH_CARD_STATUS, METHOD } from 'global';

import React, { useEffect, useRef, useState } from 'react';
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

type Props = {};

const FlashCardStatusOptions = [
  {
    label: 'Tất cả',
    value: '',
  },
  {
    label: 'Chưa xem',
    value: FLASH_CARD_STATUS.UNREVIEW,
  },
  {
    label: 'Đã xem',
    value: FLASH_CARD_STATUS.REVIEWED,
  },
  {
    label: 'Cần xem lại',
    value: FLASH_CARD_STATUS.REVIEW_AGAIN,
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
      <div className="px-5 py-6 flex justify-between">
        <div className="text-lg font-semibold">Danh sách flashcard</div>
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
            <Plus /> Thêm flashcard
          </button>
        </div>
      </div>
      {data?.items.length ? (
        <div className="p-5 flex-1 grid grid-cols-4  gap-4 overflow-y-auto">
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
      <ModalProvider
        dialogClass="!bg-transparent !rounded-none !overflow-visible"
        show={viewModal.show}
        onClose={() => setViewModal({ show: false, currentIdx: 0 })}
      >
        {delaySlider ? (
          <FlashCardViewer
            flashCards={data?.items ?? []}
            currentIdx={viewModal.currentIdx}
          />
        ) : (
          <Preload />
        )}
      </ModalProvider>
    </Loader>
  );
};

export default FlashCard;