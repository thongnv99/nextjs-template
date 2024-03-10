import ExamHistory from 'components/ExamHistory';
import React from 'react';

interface ExamHistoryPageProps {
  params: {
    examId: string;
  };
}

const ExamHistoryPage = (props: ExamHistoryPageProps) => {
  return <ExamHistory examId={props.params.examId} />;
};

export default ExamHistoryPage;
