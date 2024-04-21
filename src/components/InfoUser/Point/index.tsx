import React from 'react';
import './style.scss';
import { ICellRendererParams } from 'ag-grid-community';
interface PointCellProps extends ICellRendererParams {}
const PointCell = (props: PointCellProps) => {
  const data = props.data;
  if (!data) {
    return null;
  }

  const correct = data.statScore.totalCorrect || 0;
  const total = data.statScore.total || 0;
  const point = correct && total ? (correct / (total ?? 1)) * 100 : 0;
  return (
    <div className="flex items-center gap-x-2">
      <div
        className="progress rounded-full w-60"
        role="progressbar"
        aria-label="Success example"
        aria-valuenow={point}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar bg-success"
          style={{ width: `${point}%` }}
        ></div>
      </div>
      <span>
        {correct}/{total}
      </span>
    </div>
  );
};
export default PointCell;
