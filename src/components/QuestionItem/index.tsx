import { Disclosure, Transition } from '@headlessui/react';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import Trash from 'assets/svg/trash.svg';
import Edit from 'assets/svg/edit.svg';
import Copy from 'assets/svg/copy.svg';
import More from 'assets/svg/more-vertical.svg';
import Chevron from 'assets/svg/chevron-down.svg';
import { IQuestion } from 'interfaces';
import { METHOD, QUESTION_LEVEL, QUESTION_TYPE, ROLES } from 'global';
import { formatNumber, isBlank, uuid } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import ModalProvider from 'components/ModalProvider';
import Loader from 'components/Loader';
import ConfirmModal from 'components/ConfirmModal';
import Delete from 'assets/svg/delete.svg';
import { useMutation } from 'hooks/swr';
import { useParams, useRouter } from 'next/navigation';
import ArrowRight from 'assets/svg/arrow-right.svg';
import './style.scss';
import Badge from 'components/Badge';
import { LEVEL_TRANSLATE, QUESTION_STATUS_TRANSLATE } from 'global/translate';
import { useSession } from 'next-auth/react';
import Checkbox from 'elements/CheckBox';
import FeedbackBtn from 'components/FeedBackBtn';
import QuestionDetailModal from 'components/QuestionDetail';
import MenuDropdown from 'elements/MenuDrodown';
type Props = {
  data: IQuestion;
  onRefresh?: () => void;
  onDelete?: () => void;
  onRowCheckedChange?: (data: IQuestion, value?: boolean) => void;
  showDelete?: boolean;
  hideAction?: boolean;
  showCheckBox?: boolean;
  checked?: boolean;
};

const mapQuestionType = {
  [QUESTION_TYPE.ESSAY]: 'Tự luận',
  [QUESTION_TYPE.MULTIPLE_CHOICE]: 'Trắc nghiệm',
  [QUESTION_TYPE.FILL_IN_THE_BLANK]: 'Điền vào chỗ trống',
};

const QuestionItem = (props: Props) => {
  const router = useRouter();
  const { lng } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
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
      props.onRefresh?.();
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
  const question = props.data;
  return (
    <div className="w-full flex flex-col question-item">
      <div className="flex gap-4 items-center justify-between p-2 rounded-lg border transition duration-75 border-gray-200 shadow-sm">
        <div className="flex flex-col gap-[4px] overflow-hidden">
          <div className="flex gap-2">
            {props.data.isSample && (
              <Badge
                content="Mẫu"
                className="bg-primary-100 text-primary-500 text-[1rem]"
              />
            )}
            <Badge
              content={LEVEL_TRANSLATE[props.data.level]}
              className={`${mapColor[props.data.level]} text-[1rem]`}
            />
            <Badge
              content={mapQuestionType[props.data.type]}
              className={`bg-green-100 text-green-500 text-[1rem]`}
            />
            {props.data.tags &&
              props.data.tags
                ?.split(',')
                .map((tag, idx) => (
                  <Badge
                    key={idx}
                    content={tag ?? '--'}
                    className={`bg-red-100 text-red-500 text-[1rem]`}
                  />
                ))}
          </div>
          <div
            onClick={() => setModalDetail(true)}
            className="text-sm text-left cursor-pointer text-gray-900 font-semibold h-[2rem] overflow-hidden"
            dangerouslySetInnerHTML={{ __html: props.data.content }}
          ></div>
        </div>
        {!props.hideAction && (
          <MenuDropdown
            buttonRender={More}
            options={[
              {
                label: 'Nhân bản',
                onClick: handleCopy as unknown as MouseEventHandler,
              },
              {
                label: 'J_57',
                onClick: handleEdit as unknown as MouseEventHandler,
                hide:
                  props.data.isSample &&
                  ![ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role),
              },
              {
                label: 'J_58',
                onClick: handleDelete as unknown as MouseEventHandler,
                hide:
                  props.data.isSample &&
                  ![ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role),
              },
            ]}
          />
        )}

        {props.showDelete && (
          <div className="flex gap-8">
            <Delete
              onClick={props.onDelete}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Xóa"
              className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
            />
          </div>
        )}
        {props.showCheckBox && (
          <div className="flex gap-8">
            <Checkbox
              selected={props.checked}
              onChange={(_, value) => {
                props.onRowCheckedChange?.(props.data, value);
              }}
            />
          </div>
        )}
      </div>
      <ModalProvider show={modalDelete} onClose={handleCloseDelete}>
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

      <ModalProvider show={modalDetail} onClose={() => setModalDetail(false)}>
        <QuestionDetailModal
          data={props.data}
          onClose={() => setModalDetail(false)}
        />
      </ModalProvider>
    </div>
  );
};

export default QuestionItem;
