'use client';
import React from 'react';
import EmptyState from 'assets/svg/empty-state.svg';
import ErrorState from 'assets/svg/error-state.svg';
import { useTranslation } from 'app/i18n/client';

interface Props {
  type: 'error' | 'empty';
  errorMessage?: string;
  buttonLabel?: string;
  onClick?: () => void;
}

const config = {
  empty: {
    icon: <EmptyState />,
    label: 'J_161',
  },
  error: {
    icon: <ErrorState />,
    label: 'J_162',
  },
};

const EmptyData = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div>{config[props.type].icon}</div>
      <div className="font-bold text-lg mb-4">
        {' '}
        {t(config[props.type].label)}
      </div>
      <button className="w-[20rem] !rounded-[1.8rem] btn-primary bg-primary-500 text-white">
        {props.buttonLabel ?? 'OK'}
      </button>
    </div>
  );
};

export default EmptyData;
