'use client';
import { ICellRendererParams } from 'ag-grid-community';
import { useTranslation } from 'app/i18n/client';
import React from 'react';

interface BadgeCellProps extends ICellRendererParams {
  dot?: boolean;
  colorClass?: Record<string, string>;
}
const BadgeCell = (props: BadgeCellProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full flex items-center">
      <div
        className={`text-[1.2rem]  h-[2.2rem] flex items-center font-semibold  px-[0.8rem] py-[0.2rem] rounded-[1.6rem]  ${
          props.colorClass?.[props.value] ?? ''
        }`}
      >
        {props.dot ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            className="mr-[0.6rem]"
          >
            <circle cx="4" cy="4" r="3" fill="currentColor" />
          </svg>
        ) : (
          ''
        )}
        {t(props.value)}
      </div>
    </div>
  );
};

export default BadgeCell;
