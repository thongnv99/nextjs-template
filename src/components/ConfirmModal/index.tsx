'use client';
import React from 'react';
import SuccessIcon from 'assets/svg/notice-success.svg';
import WaringIcon from 'assets/svg/notice-warning.svg';
import ErrorIcon from 'assets/svg/notice-error.svg';
import { useTranslation } from 'app/i18n/client';

interface NoticeModalProps {
  type: 'error' | 'warning' | 'success';
  title?: string;
  content?: string;
  labelConfirm?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const MapIcon = {
  success: <SuccessIcon />,
  warning: <WaringIcon />,
  error: <ErrorIcon />,
};

const ConfirmModal = (props: NoticeModalProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-[35rem] flex flex-col items-center p-4">
      <div className="mb-4">{MapIcon[props.type]}</div>
      <div
        className="text-lg font-bold text-gray-900 mb-2"
        dangerouslySetInnerHTML={{ __html: t(props.title ?? '')! }}
      ></div>
      <div
        className="w-full text-center text-sm font-normal text-gray-500 mb-6"
        dangerouslySetInnerHTML={{ __html: t(props.content ?? '')! }}
      ></div>
      <div className="w-full flex gap-2">
        <button className="btn  !w-full" type="button" onClick={props.onCancel}>
          {t('Đóng')}
        </button>
        <button
          className="btn btn-primary !w-full"
          type="button"
          onClick={props.onConfirm}
        >
          {t(props.labelConfirm ?? 'Đồng ý')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
