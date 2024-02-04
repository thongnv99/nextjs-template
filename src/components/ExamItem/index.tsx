import { Disclosure, Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import Trash from 'assets/svg/trash.svg';
import Edit from 'assets/svg/edit.svg';
import Copy from 'assets/svg/copy.svg';
import Chevron from 'assets/svg/chevron-down.svg';
import { IExam, IQuestion } from 'interfaces';
import { METHOD, QUESTION_TYPE } from 'global';
import { formatNumber, uuid } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import ModalProvider from 'components/ModalProvider';
import Loader from 'components/Loader';
import ConfirmModal from 'components/ConfirmModal';
import { useMutation } from 'hooks/swr';
import { useParams, useRouter } from 'next/navigation';
import Calendar from 'assets/svg/calendar.svg';
import HelpCircle from 'assets/svg/help-circle.svg';
import Layer from 'assets/svg/3-layers.svg';
import Star from 'assets/svg/star.svg';

type Props = { data: IExam; onRefresh(): void };

const ExamItem = (props: Props) => {
  const router = useRouter();
  const { lng } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const componentId = useRef(uuid());
  const { trigger: deleteQuestion } = useMutation('EXAM_DELETE_QUESTION', {
    url: '/api/v1/exams/{questionId}',
    method: METHOD.DELETE,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Xóa đề thi',
      content: 'Xóa đề thi thành công',
    },
    onSuccess() {
      handleCloseDelete();
      props.onRefresh();
    },
  });

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/customer/exam/config/${props.data.id}`);
  };
  const handleCopy = (event: MouseEvent) => {
    event.stopPropagation();
    // router.push(`/${lng}/customer/question/question-form/${props.data.id}`);
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

  const questionCount = props.data.parts.reduce(
    (prev, curr) => prev + curr.questions.length,
    0,
  );
  return (
    <Disclosure>
      {({ open }) => {
        return (
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between p-4 rounded-lg border transition duration-75 border-gray-200 shadow-sm">
              <div className="flex flex-col justify-between items-start">
                <div
                  className="text-base text-left text-gray-900 font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: props.data.title }}
                ></div>
                <div className="text-sm flex items-center gap-4 text-gray-500 font-normal">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-[1.6rem] h-[1.6rem]" />{' '}
                    <div>
                      {' '}
                      {formatDateToString(
                        new Date(props.data.createdAt),
                        'dd/MM/yyyy',
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layer className="w-[1.6rem] h-[1.6rem]" />{' '}
                    <div>{`${props.data.parts.length} phần thi`} </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-[1.6rem] h-[1.6rem]" />{' '}
                    <div>{`${questionCount} câu hỏi`} </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Star className="w-[1.6rem] h-[1.6rem]" />{' '}
                    <div>10 điểm</div>
                  </div> */}
                </div>
              </div>
              <div className="flex gap-6">
                <Copy
                  onClick={handleCopy}
                  className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                />
                <Edit
                  onClick={handleEdit}
                  className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                />
                <Trash
                  onClick={handleDelete}
                  className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                />
              </div>
            </div>
            <ModalProvider show={modalDelete}>
              <Loader id={componentId.current}>
                <ConfirmModal
                  title="Xóa đề thi"
                  content="Đề thi sẽ được xóa vĩnh viễn. Bạn có chắc chắn muốn xóa câu hỏi này không?"
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

export default ExamItem;
