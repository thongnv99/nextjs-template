import React, { useRef,useEffect } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject, HighchartsReactProps } from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting'
import CompetitionInfo from 'components/CompetitionInfo'

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}


interface PieChartProps {
    data: [string, number][];
  }

const ExamSummaryChart: React.FC<PieChartProps & HighchartsReact.Props> = ({ data, ...props })=> {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  useEffect(() => {
    // Kiểm tra xem chart đã được tạo chưa
    if (chartComponentRef.current && chartComponentRef.current.chart) {
        const chart = chartComponentRef.current.chart;

        // Thay đổi kích thước của biểu đồ
        chart.setSize(250, 150); // Chỉnh sửa kích thước theo ý muốn
    }
}, [data])
  const options: Highcharts.Options = {
    chart: {
        type: 'pie', 
    },
    title: {
        text: '',
    },
    plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '50%',
  

          dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
              // distance: -50,
              // filter: {
              //     property: 'percentage',
              //     operator: '>',
              //     value: 4
              // }
          }
      }
  },
    // plotOptions: {
    //     pie: {
    //         innerSize: '50%',
    //         depth: 45
    //     }
    // },
    series: [{
        data: data,
        type:'pie'
    }],
};

  return (
    <div className="w-1/2 flex border gap-x-40 rounded-lg shadow-md">
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
      
    />
      <CompetitionInfo/>
    </div>
    
  );
};

export default ExamSummaryChart


