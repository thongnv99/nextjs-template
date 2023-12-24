'use client';
import { IFlashCard } from 'interfaces';
import React, { useRef, useState } from 'react';
import Edit from 'assets/svg/edit.svg';
import Trash from 'assets/svg/trash.svg';
import ModalProvider from 'components/ModalProvider';
import { uuid } from 'utils/common';
import Loader from 'components/Loader';
import ConfirmModal from 'components/ConfirmModal';
import { useMutation } from 'hooks/swr';
import { METHOD } from 'global';
import { mutate } from 'swr';
import { FLASH_CARD_QUERY_LIST } from 'store/key';
import FlashCardForm from '../FlashCardForm';

type FlashCardItemProps = {
  data: IFlashCard;
};

const FlashCardItem = ({ data }: FlashCardItemProps) => {
  const componentId = useRef(uuid());
  const [modalDelete, setModalDelete] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);

  const { trigger: deleteCard } = useMutation('FLASH_CARD_DELETE', {
    url: '/api/v1/flashcards/{flashcardId}',
    method: METHOD.DELETE,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Xóa flash card',
      content: 'Xóa flash card thành công',
    },
    onSuccess() {
      handleCloseDelete();
      mutate(FLASH_CARD_QUERY_LIST);
    },
  });

  const handleConfirmDelete = () => {
    deleteCard({
      flashcardId: data.id,
    });
  };
  const handleCloseDelete = () => {
    setModalDelete(false);
  };
  const handleShowDelete = () => {
    setModalDelete(true);
  };
  const handleCloseUpdate = () => {
    setModalUpdate(false);
  };
  const handleShowUpdate = () => {
    setModalUpdate(true);
  };
  return (
    <div className="flash-card-items  rounded-lg border border-gray-200 shadow-lg h-[25rem] overflow-hidden flex flex-col">
      <div className="bg-primary-500 text-white p-4 font-normal">
        {data.question}
      </div>
      <div className="p-4 text-gray-500 font-normal flex-1">{data.answer}</div>
      <div className="flex justify-between p-4">
        <div></div>
        <div className="flex gap-5 text-gray-500">
          <Edit className="cursor-pointer" onClick={handleShowUpdate} />
          <Trash className="cursor-pointer" onClick={handleShowDelete} />
        </div>
      </div>
      <ModalProvider show={modalDelete}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="Xóa flash card"
            content="Bạn có chắc chắn muốn xóa flash card này không?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDelete}
            type={'warning'}
          />
        </Loader>
      </ModalProvider>
      <ModalProvider show={modalUpdate}>
        <FlashCardForm data={data} onClose={handleCloseUpdate} />
      </ModalProvider>
    </div>
  );
};

export default FlashCardItem;
