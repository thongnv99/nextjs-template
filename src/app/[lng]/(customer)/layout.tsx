'use client';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import { usePathname } from 'next/navigation';
import React from 'react';
import './layout.scss';
import { useSession } from 'next-auth/react';

const CustomerLayout = (props: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { status } = useSession();
  return (
    <div className=" customer-layout h-full w-full flex flex-col">
      <Header />
      <div className=" w-full flex-1 flex overflow-hidden relative">
        {['do-exam', 'do-contest'].every(item => !pathname.includes(item)) &&
          (!pathname.includes('blog') || status === 'authenticated') && (
            <div
              id="sidebar"
              className="absolute  right-0 top-0   z-10 md:relative bg-white w-full md:w-[28rem] h-full border-l md:border-r border-r-gray-200"
            >
              <Sidebar />
            </div>
          )}
        <div className="flex-1 flex flex-col bg-[#F9FAFB] h-full  p-2 md:p-4  overflow-y-auto overflow-x-hidden">
          <div className="flex-1">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
