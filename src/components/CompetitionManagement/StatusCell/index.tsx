import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';
import {EXAM_STATUS} from 'global'


interface StatusCellProps extends ICellRendererParams {
  colorClass?: Record<string, string>;
  value: keyof typeof EXAM_STATUS; // Specify the type of value
}
const  StatusCell=(props:StatusCellProps)=>{
    const labelStatus={
        [EXAM_STATUS.DRAFT]:'Nháp',
        [EXAM_STATUS.PUBLISH]:'Đã mở',
    }
    return (
        <div className={`${props.colorClass?.[props.value]??''} flex items-center rounded-full leading-none p-[1rem] text-[1.2rem]`}>
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
            {labelStatus[props.value]}
        </div>
    )
}
export default StatusCell