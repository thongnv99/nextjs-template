'use client';
import { useTranslation } from 'app/i18n/client';
import React from 'react';

interface BadgeCellProps {
  dot?: boolean;
  className?: string;
  content: string;
}
const Badge = (props: BadgeCellProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={`text-[1.2rem]  whitespace-nowrap h-[2.2rem] flex items-center font-semibold  px-[0.8rem] py-[0.2rem] rounded-[1.6rem]  ${
        props.className ?? ''
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
      )}{' '}
      {t(props.content)}
    </div>
  );
};

export default Badge;
