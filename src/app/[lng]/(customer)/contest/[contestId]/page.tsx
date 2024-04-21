import ContestDetail from 'components/ContestDetail';
import React from 'react';

interface Props {
  params: {
    lng: string;
    contestId: string;
  };
}
const ContestDetailPage = (props: Props) => {
  return <ContestDetail contestId={props.params.contestId} />;
};

export default ContestDetailPage;
