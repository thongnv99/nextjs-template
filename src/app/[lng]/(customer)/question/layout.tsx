'use client';
import React, { useEffect } from 'react';
import { mutate } from 'swr';

type Props = {
  children: React.ReactNode;
};

const ExamLayout = (props: Props) => {
  useEffect(() => {
    return () => {
      mutate('QUESTION_FILTER', null);
    };
  }, []);

  return props.children;
};

export default ExamLayout;
