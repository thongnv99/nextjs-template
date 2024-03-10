import React from 'react';
import './style.scss';
type Props = {
  options: {
    size: number;
    borderWidth: number;
    padding: number;
    stroke?: string;
    percent: number;
  };
};

const PercentChart = (props: Props) => {
  const { size, borderWidth, padding, stroke, percent } = props.options;
  const circumference = size * 2 * Math.PI;
  const offset = circumference + (percent / 100) * circumference;
  // style={`stroke-dasharray: ${circumference}, ${circumference}; stroke-dashoffset: ${offset};`}
  return (
    <svg
      className="percent-chart"
      width={(size + borderWidth) * 2 + padding}
      height={(size + borderWidth) * 2 + padding}
    >
      <circle
        stroke={'#e8e8e8'}
        strokeWidth={borderWidth}
        fill="transparent"
        r={size}
        radius={10}
        strokeLinecap="round"
        cx={size + borderWidth + padding / 2}
        cy={size + borderWidth + padding / 2}
      >
        <animate
          attributeName="stroke-dashoffset"
          attributeType="XML"
          from={-circumference}
          to={-offset}
          dur="1s"
          fill="freeze"
        />
      </circle>
      <circle
        strokeDashoffset={-offset}
        strokeDasharray={`${circumference}, ${circumference}`}
        stroke={stroke ?? '#1d64d8'}
        strokeWidth={borderWidth}
        fill="transparent"
        r={size}
        radius={10}
        strokeLinecap="round"
        cx={size + borderWidth + padding / 2}
        cy={size + borderWidth + padding / 2}
      >
        <animate
          attributeName="stroke-dashoffset"
          attributeType="XML"
          from={-circumference}
          to={-offset}
          dur="1s"
          fill="freeze"
        />
      </circle>
    </svg>
  );
};

export default PercentChart;
