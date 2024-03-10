import DoExam from 'components/DoExam';
import React from 'react';

interface DoExamPageProps {
  params: {
    examId: string;
  };
}

const DoExamPage = (props: DoExamPageProps) => {
  return <DoExam examId={props.params.examId} />;
};

export default DoExamPage;
