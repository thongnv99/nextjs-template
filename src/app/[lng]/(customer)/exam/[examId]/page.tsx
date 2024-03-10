import ExamDetail from 'components/ExamDetail';
import React from 'react';

interface Props {
  params: {
    lng: string;
    examId: string;
  };
}
const ExamDetailPage = (props: Props) => {
  return <ExamDetail examId={props.params.examId} />;
};

export default ExamDetailPage;
