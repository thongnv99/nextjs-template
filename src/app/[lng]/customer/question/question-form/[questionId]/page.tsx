import QuestionForm from 'components/QuestionForm';
import React from 'react';

const CopyQuestionFormPage = ({
  params,
}: {
  params: { questionId: string };
}) => {
  console.log({ params });
  return <QuestionForm questionId={params.questionId} isEdit={false} />;
};

export default CopyQuestionFormPage;
