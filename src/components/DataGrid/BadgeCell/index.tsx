import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';

interface BadgeCellProps extends ICellRendererParams {
  dot?: boolean;
  colorClass?: Record<string, string>;
}
const BadgeCell = (props: BadgeCellProps) => {
  return (
    <div className="w-full h-full flex items-center">
      <div
        className={`text-[1.2rem]  h-[2.2rem] flex items-center font-semibold  px-[0.8rem] py-[0.2rem] rounded-[1.6rem]  ${
          props.colorClass?.[props.value] ?? ''
        }`}
      >
        {props.dot ? (
          <div className="text-[2rem] leading-[1rem] mr-1">•</div>
        ) : (
          ''
        )}{' '}
        {props.value}
      </div>
    </div>
  );
};

export default BadgeCell;
