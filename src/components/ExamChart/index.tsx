'use client';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './style.scss';

import React from 'react';
const ExamChart = ({ data }: { data: Record<string, unknown>[] }) => {
  const options: Highcharts.Options = {
    chart: {
      style: {
        fontFamily: 'var(--font-lexend)',
      },
    },
    credits: { enabled: false },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      startOnTick: true,
      endOnTick: true,
      tickPixelInterval: 100,
    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineWidth: 0,
      lineWidth: 1,
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      xDateFormat: '%H:%M:%S %d/%m/%Y',
      // formatter: function () {
      //   return (
      //     '<b> Thời gian:' +
      //     Highcharts.dateFormat('%H:%M:%S %d/%m/%Y', this.x as number) +
      //     '</b><br/>' +
      //     'Điểm: ' +
      //     this.y
      //   );
      // },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: 'line',
        name: 'Điểm',
        data: data
          .filter(item => item.status === 'FINISHED')
          .map(item => [
            item.endTime as number,
            (item.statScore as any).totalCorrect ?? 0,
          ]),
        // zones: [
        //   {
        //     value: 0,
        //     color: 'red',
        //   },
        //   {
        //     value: 0.5,
        //     color: 'yellow',
        //   },
        //   {
        //     color: 'red',
        //   },
        // ],
      },
    ],
  };
  return (
    <div className="h-full exam-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
      />
    </div>
  );
};

export default ExamChart;
