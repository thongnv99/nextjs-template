import ContestHistory from 'components/ContestHistory';
import React from 'react';

type Props = {
  params: {
    contestId: string;
  };
};

const ContestHistoryPage = (props: Props) => {
  return <ContestHistory contestId={props.params.contestId} />;
};

export default ContestHistoryPage;
