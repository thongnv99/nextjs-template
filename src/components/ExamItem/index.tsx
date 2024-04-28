'use client';
import { Disclosure } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { useMutation } from 'hooks/swr';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IExam } from 'interfaces';
import { METHOD, ROLES } from 'global';
import { formatDateToString } from 'utils/datetime';
import { uuid } from 'utils/common';
import { useTranslation } from 'app/i18n/client';
import Trash from 'assets/svg/trash.svg';
import Edit from 'assets/svg/edit.svg';
import Link from 'assets/svg/external-link.svg';
import Upload from 'assets/svg/upload.svg';
import Calendar from 'assets/svg/calendar.svg';
import HelpCircle from 'assets/svg/help-circle.svg';
import Layer from 'assets/svg/3-layers.svg';
import FileText from 'assets/svg/file-text.svg';
import ModalProvider from 'components/ModalProvider';
import Badge from 'components/Badge';
import Loader from 'components/Loader';
import ConfirmModal from 'components/ConfirmModal';

type Props = { data: IExam; onRefresh(): void; compact?: boolean };

const ExamItem = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { lng } = useParams();
  const [modalDelete, setModalDelete] = useState(false);
  const [modalPublish, setModalPublish] = useState(false);
  const componentId = useRef(uuid());
  const { data: session } = useSession();
  const { trigger: deleteExam } = useMutation('EXAM_DELETE_QUESTION', {
    url: '/api/v1/exams/{examId}',
    method: METHOD.DELETE,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'J_48',
      content: 'J_49',
    },
    onSuccess() {
      handleCloseDelete();
      props.onRefresh();
    },
  });

  const { trigger: updateExam } = useMutation('EXAM_UPDATE_EXAM', {
    url: '/api/v1/exams/{examId}',
    method: METHOD.PUT,
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'J_50',
      content: 'J_51',
    },
    onSuccess() {
      handleClosePublish();
      props.onRefresh();
    },
  });

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/exam/config/${props.data.id}`);
  };
  const handleDoExam = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/exam/${props.data.id}`);
  };
  const handleViewHistory = (event: MouseEvent) => {
    event.stopPropagation();
    router.push(`/${lng}/exam/history/${props.data.id}`);
  };
  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    setModalDelete(true);
  };

  const handlePublish = (event: MouseEvent) => {
    event.stopPropagation();
    setModalPublish(true);
  };

  const handleConfirmDelete = () => {
    deleteExam({
      examId: props.data.id,
    });
  };
  const handleCloseDelete = () => {
    setModalDelete(false);
  };
  const handleClosePublish = () => {
    setModalPublish(false);
  };

  const handleConfirmPublish = () => {
    updateExam({
      examId: props.data.id,
      isSample: true,
    });
  };

  const questionCount = props.data.parts.reduce(
    (prev, curr) => prev + curr.questions.length,
    0,
  );
  return (
    <div className="w-full flex flex-col ">
      <div className=" hover:bg-primary-50 cursor-pointer flex items-center justify-between p-2 rounded-lg border transition duration-75 border-gray-200 shadow-sm">
        <div className="flex flex-col justify-between items-start">
          <div className="flex">
            <div
              className="text-base text-left text-gray-900 font-semibold  cursor-pointer"
              dangerouslySetInnerHTML={{ __html: props.data.title }}
              onClick={handleDoExam as any}
            ></div>
            {props.data.isSample && (
              <Badge
                content="Mẫu"
                className="bg-primary-100 text-primary-500 ml-4  text-[1rem]"
              />
            )}
          </div>
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
              <div>{t('J_52', { count: props.data.parts.length })} </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-[1.6rem] h-[1.6rem]" />{' '}
              <div>{t('J_53', { count: questionCount })} </div>
            </div>
          </div>
        </div>
        {!props.compact && (
          <div className="hidden md:flex gap-6">
            <Link
              data-tooltip-id="default-tooltip"
              data-tooltip-content={t('J_54')}
              onClick={handleDoExam}
              className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
            />
            <FileText
              data-tooltip-id="default-tooltip"
              data-tooltip-content={t('J_55')}
              onClick={handleViewHistory}
              className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
            />
            {(!props.data.isSample ||
              [ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role)) && (
              <>
                <Edit
                  data-tooltip-id="default-tooltip"
                  data-tooltip-content={t('J_57')}
                  onClick={handleEdit}
                  className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                />
                <Trash
                  data-tooltip-id="default-tooltip"
                  data-tooltip-content={t('J_58')}
                  onClick={handleDelete}
                  className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-900 transition-all"
                />
              </>
            )}
          </div>
        )}
      </div>
      <ModalProvider show={modalDelete}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="J_48"
            content="J_59"
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDelete}
            type={'warning'}
          />
        </Loader>
      </ModalProvider>
      <ModalProvider show={modalPublish}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="J_50"
            content="J_60"
            onConfirm={handleConfirmPublish}
            onCancel={handleClosePublish}
            type={'success'}
          />
        </Loader>
      </ModalProvider>
    </div>
  );
};

export default ExamItem;
