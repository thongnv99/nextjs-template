'use client';
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import LanguagePicker from 'components/LanguagePicker';
import UserDropdown from 'components/UserDropdown';

const NavConfig = [
  {
    label: 'Đề thi',
    route: '/',
  },
  {
    label: 'Lịch sử thi',
    route: '/',
  },
  {
    label: 'Flash card',
    route: '/',
  },
  {
    label: 'Blog',
    route: '/',
  },
  {
    label: 'Thanh toán',
    route: '/',
  },
];
const Header = () => {
  const { data } = useSession();

  return (
    <header className="h-[9.4rem] w-full  px-4 flex justify-between items-center shadow-sm">
      <div>Japanese Example</div>
      <nav className="h-full flex items-center">
        {NavConfig.map((item, idx) => (
          <Link
            className={`px-8 mx-2 h-full flex border-b-[4px] border-transparent  items-center text-base font-medium text-gray-500 hover:text-primary ${
              idx === 0 ? 'text-primary  !border-primary-500' : ''
            }`}
            href={item.route}
            key={idx}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center  divide-x">
        <div className="mr-4 h-fit">
          <LanguagePicker />
        </div>
        <div className="pl-4 flex items-center justify-center">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
