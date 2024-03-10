import QuestionForm from 'components/QuestionForm';
import React from 'react';

const CopyQuestionFormPage = ({
  params,
}: {
  params: { questionId: string };
}) => {
  return <QuestionForm questionId={params.questionId} isEdit={true} />;
};

export default CopyQuestionFormPage;
