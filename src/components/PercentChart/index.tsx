import React from 'react';
import './style.scss';
type Props = {
  options: {
    size: number;
    borderWidth: number;
    padding: number;
    stroke?: string;
    label?: string;
    value: number;
    total: number;
  };
};

const PercentChart = (props: Props) => {
  const { size, borderWidth, padding, stroke, total, value } = props.options;
  const percent = value && total ? (value * 100) / total : 0;
  const circumference = size * 2 * Math.PI;
  const offset = circumference + (percent / 100) * circumference;
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

      <text y="50%" transform="translate(0, 2)">
        <tspan x="50%" textAnchor="middle" className="text-[3rem] font-bold">
          <tspan
            fill={percent < 0.5 ? 'red' : percent < 0.7 ? 'yellow' : 'green'}
            color="red"
            className="text-primary"
          >
            {value}
          </tspan>
          /<tspan>{total}</tspan>
        </tspan>
      </text>
      <text y="60%" transform="translate(0, 2)">
        <tspan x="50%" textAnchor="middle" className="donut-data">
          {props.options.label}
        </tspan>
      </text>
    </svg>
  );
};

export default PercentChart;
