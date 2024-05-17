'use client';
import React, { MouseEventHandler, useRef, useState } from 'react';
import { IContest } from 'interfaces';
import { METHOD, ROLES } from 'global';
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
import Badge from 'components/Badge';
import { useUserInfo } from 'hooks/common';
import More from 'assets/svg/more-vertical.svg';
import MenuDropdown from 'elements/MenuDrodown';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'app/i18n/client';

type Props = {
  data: IContest;
  onRefresh(): void;
  compact?: boolean;
  inPicker?: boolean;
  onSelect?: (exam: IContest) => void;
};

const ContestItem = (props: Props) => {
  const router = useRouter();
  const { lng } = useParams();
  const { t } = useTranslation();
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
      title: 'J_132',
      content: 'J_133',
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
        title: 'J_134',
        content: 'J_135',
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
    if (props.inPicker) {
      return;
    }
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
    DRAFT: 'J_136',
    PUBLISH: 'J_137',
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
      <div
        onClick={() => props.onSelect?.(props.data)}
        className="flex hover:bg-primary-50 cursor-pointer items-center justify-between p-2 rounded-lg border transition duration-75 border-gray-200 shadow-sm"
      >
        <div
          style={{ maxWidth: 'calc(100% - 30px)' }}
          className="flex flex-col justify-between items-start"
        >
          <div className="flex w-full">
            <div
              className="text-base text-left text-gray-900 font-semibold  text-ellipsis truncate    cursor-pointer"
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
            {!props.compact && !props.inPicker && (
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
              <div>{t('J_52', { count: props.data.parts.length })} </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <HelpCircle className="w-[1.6rem] h-[1.6rem]" />{' '}
              <div>{t('J_53', { count: questionCount })} </div>
            </div>
          </div>
        </div>
        {!props.compact && !props.inPicker && (
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
                label: 'J_56',
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
            title="J_132"
            content="J_138"
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
            title="J_134"
            content="J_139"
            onCancel={handleClosePublish}
            onConfirm={handleConfirmPublish}
          />
        </Loader>
      </ModalProvider>
    </div>
  );
};

export default ContestItem;
