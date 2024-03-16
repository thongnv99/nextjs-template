import React from 'react';
import './style.scss';
interface Point {
  point: number;
  total: number;
  correct: number;
}
const InfoUserPoint = (props: Point) => {
  return (
    <div className="flex items-center gap-x-2">
      <div
        className="progress rounded-full w-60"
        role="progressbar"
        aria-label="Success example"
        aria-valuenow={props.point}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar bg-success"
          style={{ width: `${props.point}%` }}
        ></div>
      </div>
      <span>
        {props.correct}/{props.total}
      </span>
    </div>
  );
};
export default InfoUserPoint;
