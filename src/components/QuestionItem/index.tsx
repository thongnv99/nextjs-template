import { Disclosure, Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import Trash from 'assets/svg/trash.svg';
import Edit from 'assets/svg/edit.svg';
import Copy from 'assets/svg/copy.svg';
import Chevron from 'assets/svg/chevron-down.svg';
import { IQuestion } from 'interfaces';
import { METHOD, QUESTION_LEVEL, QUESTION_TYPE, ROLES } from 'global';
import { formatNumber, uuid } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import ModalProvider from 'components/ModalProvider';
import Loader from 'components/Loader';
import ConfirmModal from 'components/ConfirmModal';
import { useMutation } from 'hooks/swr';
import { useParams, useRouter } from 'next/navigation';
import './style.scss';
import Badge from 'components/Badge';
import { LEVEL_TRANSLATE } from 'global/translate';
import { useSession } from 'next-auth/react';
type Props = { data: IQuestion; onRefresh(): void };

const mapQuestionType = {
  [QUESTION_TYPE.ESSAY]: 'Tự luận',
  [QUESTION_TYPE.MULTIPLE_CHOICE]: 'Trắc nghiệm',
  [QUESTION_TYPE.FILL_IN_THE_BLANK]: 'Điền vào chỗ trống',
};

const QuestionItem = (props: Props) => {
  const router = useRouter();
  const { lng } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const componentId = useRef(uuid());

  const { data: session } = useSession();

  const { trigger: deleteQuestion } = useMutation('QUESTION_DELETE_QUESTION', {
    url: '/api/v1/questions/{questionId}',
    method: METHOD.DELETE,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Xóa câu hỏi',
      content: 'Xóa câu hỏi thành công',
    },
    onSuccess() {
      handleCloseDelete();
      props.onRefresh();
    },
  });

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/question/update-question/${props.data.id}`);
  };
  const handleCopy = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/question/question-form/${props.data.id}`);
  };
  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    setModalDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteQuestion({
      questionId: props.data.id,
    });
  };
  const handleCloseDelete = () => {
    setModalDelete(false);
  };

  const mapColor = {
    [QUESTION_LEVEL.MEDIUM]: 'bg-yellow-100 text-yellow-500',
    [QUESTION_LEVEL.EASY]: 'bg-green-100 text-green-500',
    [QUESTION_LEVEL.HARD]: 'bg-red-100 text-red-500',
  };
  return (
    <Disclosure>
      {({ open }) => {
        return (
          <div className="w-full flex flex-col question-item">
            <Disclosure.Button>
              <div className="flex items-center justify-between p-4 rounded-lg border transition duration-75 border-gray-200 shadow-sm">
                <div className="flex  justify-between items-start">
                  <div
                    className="text-base text-left text-gray-900 font-semibold"
                    dangerouslySetInnerHTML={{ __html: props.data.content }}
                  ></div>
                  {props.data.isSample && (
                    <Badge
                      content="Mẫu"
                      className="bg-primary-100 text-primary-500 ml-4 -translate-y-[0.8rem] text-[1rem]"
                    />
                  )}
                  <Badge
                    content={LEVEL_TRANSLATE[props.data.level]}
                    className={`${
                      mapColor[props.data.level]
                    } ml-4 -translate-y-[0.8rem] text-[1rem]`}
                  />
                </div>
                <div className="flex gap-8">
                  <Copy
                    data-tooltip-id="default-tooltip"
                    data-tooltip-content="Nhân bản"
                    onClick={handleCopy}
                    className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                  />
                  {(!props.data.isSample ||
                    [ROLES.ADMIN, ROLES.STAFF].includes(
                      session?.user.role,
                    )) && (
                    <>
                      <Edit
                        data-tooltip-id="default-tooltip"
                        data-tooltip-content="Sửa"
                        onClick={handleEdit}
                        className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                      />
                      <Trash
                        onClick={handleDelete}
                        data-tooltip-id="default-tooltip"
                        data-tooltip-content="Xóa"
                        className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                      />
                    </>
                  )}
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
                  <div className="font-semibold mb-3">Thông tin câu hỏi</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">Loại</div>
                      <div className="font-normal text-sm text-gray-500">
                        {mapQuestionType[props.data.type]}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">
                        Danh mục
                      </div>
                      <div className="font-normal text-sm text-gray-500">
                        {props.data.questionCategoryId?.name?.[
                          lng as 'vi' | 'ja'
                        ] ?? '--'}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">Điểm</div>
                      <div className="font-normal text-sm text-gray-500">
                        {formatNumber(props.data.score ?? 1)}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="min-w-[10rem] font-semibold">Năm</div>
                      <div className="font-normal text-sm text-gray-500">
                        {props.data.year ?? '--'}
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
            <ModalProvider show={modalDelete}>
              <Loader id={componentId.current}>
                <ConfirmModal
                  title="Xóa câu hỏi"
                  content="Câu hỏi sẽ được xóa vĩnh viễn. Bạn có chắc chắn muốn xóa câu hỏi này không?"
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCloseDelete}
                  type={'warning'}
                />
              </Loader>
            </ModalProvider>
          </div>
        );
      }}
    </Disclosure>
  );
};

export default QuestionItem;
