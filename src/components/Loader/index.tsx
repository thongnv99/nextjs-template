'use client';
import React, { memo, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import Preload from 'components/Preload';
import useSWR from 'swr';
import { COMMON_LOADING } from 'store/key';
LoadingOverlay.propTypes = undefined;

interface LoaderProps {
  className?: string;
  id?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

interface LoaderState {
  componentId: string;
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  children,
  loading,
  id,
}) => {
  const { data: loaderState } = useSWR<LoaderState>(COMMON_LOADING, null);
  const [innerLoading, setInnerLoading] = useState(false);
  useEffect(() => {
    if (loaderState && loaderState.componentId === id) {
      setInnerLoading(loaderState.loading);
    }
  }, [id, loaderState]);

  return (
    <LoadingOverlay
      className={className}
      id={id}
      spinner={<Preload />}
      active={loading || innerLoading}
    >
      {children}
    </LoadingOverlay>
  );
};

export default memo<React.FC<LoaderProps>>(Loader);
