'use client';
import Header from 'components/Header';
import React from 'react';

const AdminLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1 w-full p-8 overflow-y-auto">{props.children}</div>
    </div>
  );
};

export default AdminLayout;
