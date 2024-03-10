'use client';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import { usePathname } from 'next/navigation';
import React from 'react';

const CustomerLayout = (props: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className=" w-full flex-1 flex overflow-hidden">
        {['do-exam', 'do-contest'].every(item => !pathname.includes(item)) && (
          <div className=" bg-white w-[28rem] h-full border-r border-r-gray-200">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 bg-[#F9FAFB] h-full  p-8 overflow-y-auto overflow-x-hidden">
          <div className="h-full ">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
