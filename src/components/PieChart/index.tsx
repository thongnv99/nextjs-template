import React, { useEffect, useRef } from 'react';
import Highcharts, { Options } from 'highcharts';
import CompetitionInfo from 'components/CompetitionInfo'

interface PieChartProps {
  data: [string, number][];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tạo biểu đồ khi component được render
    const chart = Highcharts.chart(chartRef.current!, {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      plotOptions: {
        pie: {
            innerSize: '50%',
            depth: 45
        }
    },
      series: [{
        name: '',
        data: data
      }]
    } as Options); // Explicitly cast options to Options type

    // Cleanup khi component unmount
    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div className="w-1/2 flex border  gap-x-10 rounded-lg shadow-md">
      <div ref={chartRef} className='w-2/5 h-full'></div>
      <CompetitionInfo/>
    </div>
  ) 
  
};

export default PieChart;