import ExamConfig from 'components/ExamConfig';
import React from 'react';

const ExamConfigPage = (props: { params: { contestId: string } }) => {
  return <ExamConfig examId={props.params.contestId} isContest />;
};

export default ExamConfigPage;
