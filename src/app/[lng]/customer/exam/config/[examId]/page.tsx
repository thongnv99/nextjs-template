import ExamConfig from 'components/ExamConfig';
import React from 'react';

const ExamConfigPage = (props: { params: { examId: string } }) => {
  return <ExamConfig examId={props.params.examId} />;
};

export default ExamConfigPage;
