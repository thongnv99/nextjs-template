'use client';
import Header from 'components/Header';
import React from 'react';

const CustomerLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className=" w-full flex-1 flex">
        <div className="side-bar bg-white w-[28rem] h-full border-r border-r-gray-200"></div>
        <div className="flex-1 bg-[#F9FAFB] h-full  p-8">
          <div className=" h-full ">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
