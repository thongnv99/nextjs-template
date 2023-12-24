'use client';
import Loader from 'components/Loader';
import { METHOD } from 'global';
import { useSWRWrapper } from 'hooks/swr';
import { FlashCardRes } from 'interfaces';
import React, { useRef, useState } from 'react';
import { uuid } from 'utils/common';
import FlashCardItem from './FlashCardItem';
import Plus from 'assets/svg/plus.svg';
import ModalProvider from 'components/ModalProvider';
import FlashCardForm from './FlashCardForm';
import { FLASH_CARD_QUERY_LIST } from 'store/key';

type Props = {};

const FlashCard = (props: Props) => {
  const componentId = useRef(uuid());
  const [createModal, setCreateModal] = useState(false);
  const { data } = useSWRWrapper<FlashCardRes>(FLASH_CARD_QUERY_LIST, {
    url: '/api/v1/flashcards',
    method: METHOD.GET,
    ignoreKeyParse: true,
  });
  console.log({ data });

  const handleCreateClick = () => {
    setCreateModal(true);
  };
  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border border-gray-200 rounded-lg flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex justify-between">
        <div className="text-lg font-semibold">Danh sách flashcard</div>
        <div>
          <button
            type="button"
            className="btn-primary btn-icon"
            onClick={handleCreateClick}
          >
            <Plus /> Thêm flashcard
          </button>
        </div>
      </div>
      {data?.items.length ? (
        <div className="p-5 flex-1 grid grid-cols-4  gap-4 overflow-y-auto">
          {data?.items.map(item => (
            <FlashCardItem data={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="text-lg font-bold text-gray-900 mb-1">
            Không tìm thấy dữ liệu
          </div>
          <div className="text-sm font-normal text-gray-500 mb-6">
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
        <FlashCardForm onClose={() => setCreateModal(false)} />
      </ModalProvider>
    </Loader>
  );
};

export default FlashCard;
