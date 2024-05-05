import { Disclosure, Transition } from '@headlessui/react';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { IContest } from 'interfaces';
import { METHOD, QUESTION_TYPE, ROLES } from 'global';
import { uuid } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import ModalProvider from 'components/ModalProvider';
import Loader from 'components/Loader';
import ConfirmModal from 'components/ConfirmModal';
import { useMutation } from 'hooks/swr';
import { useParams, useRouter } from 'next/navigation';
import Calendar from 'assets/svg/calendar.svg';
import HelpCircle from 'assets/svg/help-circle.svg';
import Layer from 'assets/svg/3-layers.svg';
import FileText from 'assets/svg/file-text.svg';
import Badge from 'components/Badge';
import { useUserInfo } from 'hooks/common';
import More from 'assets/svg/more-vertical.svg';
import MenuDropdown from 'elements/MenuDrodown';
import { useSession } from 'next-auth/react';

type Props = { data: IContest; onRefresh(): void; compact?: boolean };

const ContestItem = (props: Props) => {
  const { data: userInfo } = useUserInfo();
  const router = useRouter();
  const { lng } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const [modalPublish, setModalPublish] = useState(false);
  const { data: session } = useSession();
  const componentId = useRef(uuid());
  const { trigger: deleteContest } = useMutation('CONTEST_DELETE_CONTEST', {
    url: '/api/v1/contests/{contestId}',
    method: METHOD.DELETE,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Xóa cuộc thi',
      content: 'Xóa cuộc thi thành công',
    },
    onSuccess() {
      handleCloseDelete();
      props.onRefresh();
    },
  });
  const { trigger: updateContest } = useMutation(
    '/api/v1/contests/{contestId}',
    {
      url: '/api/v1/contests/{contestId}',
      method: METHOD.PUT,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Đăng cuộc thi',
        content: 'Đăng cuộc thi thành công',
      },
      onSuccess() {
        handleClosePublish();
        props.onRefresh();
      },
    },
  );

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/contest/config/${props.data.id}`);
  };
  const handleDoExam = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/contest/${props.data.id}`);
  };
  const handleViewHistory = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/contest/history/${props.data.id}`);
  };
  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    setModalDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteContest({
      contestId: props.data.id,
    });
  };
  const handleCloseDelete = () => {
    setModalDelete(false);
  };

  const mapBadgeColor: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-500',
    PUBLISH: 'bg-green-100 text-green-500',
  };

  const mapBadgeTranslate: Record<string, string> = {
    DRAFT: 'Nháp',
    PUBLISH: 'Đã đăng',
  };

  const handleUpload = () => {
    setModalPublish(true);
  };

  const handleClosePublish = () => {
    setModalPublish(false);
  };

  const handleConfirmPublish = () => {
    updateContest({
      contestId: props.data.id,
      status: 'PUBLISH',
    });
  };

  const questionCount = props.data.parts.reduce(
    (prev, curr) => prev + curr.questions.length,
    0,
  );

  return (
    <div className="w-full flex flex-col cu">
      <div className="flex items-center justify-between p-2 rounded-lg border transition duration-75 border-gray-200 shadow-sm">
        <div className="flex flex-col justify-between items-start">
          <div className="flex">
            <div
              className="text-base text-left text-gray-900 font-semibold  cursor-pointer"
              dangerouslySetInnerHTML={{ __html: props.data.title }}
              onClick={handleDoExam as any}
            ></div>
            <Badge
              content={mapBadgeTranslate[props.data.status]}
              className={`${
                mapBadgeColor[props.data.status]
              } ml-4  text-[1rem]`}
            />
          </div>
          <div className="text-sm flex items-center gap-4 text-gray-500 font-normal">
            {!props.compact && (
              <div className="flex items-center gap-2">
                <Calendar className="w-[1.6rem] h-[1.6rem]" />{' '}
                <div>
                  {`${formatDateToString(
                    props.data.startTime
                      ? new Date(props.data.startTime)
                      : new Date(),
                    'dd/MM/yyyy',
                  )} - ${formatDateToString(
                    props.data.endTime
                      ? new Date(props.data.endTime)
                      : new Date(),
                    'dd/MM/yyyy',
                  )}`}
                </div>
              </div>
            )}
            <div className="hidden md:flex items-center gap-2">
              <Layer className="w-[1.6rem] h-[1.6rem]" />{' '}
              <div>{`${props.data.parts.length} phần thi`} </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <HelpCircle className="w-[1.6rem] h-[1.6rem]" />{' '}
              <div>{`${questionCount} câu hỏi`} </div>
            </div>
          </div>
        </div>
        {!props.compact && (
          <MenuDropdown
            buttonRender={More}
            options={[
              {
                label: 'J_54',
                onClick: handleDoExam as unknown as MouseEventHandler,
              },
              {
                label: 'J_55',
                onClick: handleViewHistory as unknown as MouseEventHandler,
              },
              {
                label: 'Đăng',
                onClick: handleUpload as unknown as MouseEventHandler,
                hide:
                  ![ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role) ||
                  props.data.status === 'PUBLISH',
              },
              {
                label: 'J_57',
                onClick: handleEdit as unknown as MouseEventHandler,
                hide: ![ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role),
              },
              {
                label: 'J_58',
                onClick: handleDelete as unknown as MouseEventHandler,
                hide:
                  ![ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role) ||
                  props.data.status === 'PUBLISH',
              },
            ]}
          />
        )}
      </div>
      <ModalProvider show={modalDelete}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="Xóa cuộc thi"
            content="Cuộc thi sẽ được xóa vĩnh viễn. Bạn có chắc chắn muốn xóa cuộc thi này không?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDelete}
            type={'warning'}
          />
        </Loader>
      </ModalProvider>
      <ModalProvider show={modalPublish} onClose={handleClosePublish}>
        <Loader id={componentId.current}>
          <ConfirmModal
            type="success"
            title="Đăng cuộc thi"
            content="Bạn có chắc chắn muốn đăng cuộc thi này không?"
            onCancel={handleClosePublish}
            onConfirm={handleConfirmPublish}
          />
        </Loader>
      </ModalProvider>
    </div>
  );
};

export default ContestItem;
