'use client';
import React, { memo } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import Preload from 'components/Preload';
LoadingOverlay.propTypes = undefined;

interface LoaderProps {
  className?: string;
  id?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  children,
  loading,
  id,
}) => {
  return (
    <LoadingOverlay
      className={className}
      id={id}
      spinner={<Preload />}
      active={loading}
    >
      {children}
    </LoadingOverlay>
  );
};

export default memo<React.FC<LoaderProps>>(Loader);
