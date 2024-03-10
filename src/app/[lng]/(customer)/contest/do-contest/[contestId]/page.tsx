import DoExam from 'components/DoExam';
import React from 'react';

interface DoExamPageProps {
  params: {
    contestId: string;
  };
}

const DoExamPage = (props: DoExamPageProps) => {
  return <DoExam examId={props.params.contestId} isContest />;
};

export default DoExamPage;
