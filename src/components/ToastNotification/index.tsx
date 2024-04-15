'use client';
import React from 'react';
import SuccessIcon from 'assets/svg/notice-success.svg';
import WaringIcon from 'assets/svg/notice-warning.svg';
import ErrorIcon from 'assets/svg/notice-error.svg';
import { useTranslation } from 'app/i18n/client';
interface ToastNotificationProps {
  type: 'success' | 'error' | 'warning';
  content?: string;
  title?: string;
}
const MapIcon = {
  success: <SuccessIcon className="h-[3.2rem] w-[3.2rem]" />,
  warning: <WaringIcon className="h-[3.2 rem] w-[3.2rem]" />,
  error: <ErrorIcon className="h-[3.2rem] w-[3.2rem]" />,
};

const ToastNotification = (props: ToastNotificationProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      <div>{MapIcon[props.type]}</div>
      <div className="flex flex-col h-full justify-between">
        <div className="text-base font-bold text-gray-900">
          {t(props.title ?? '')}
        </div>
        <div className="text-base font-normal text-gray-500 text-ellipsis">
          {t(props.content ?? '')}
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
