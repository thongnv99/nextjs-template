'use client';
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import LanguagePicker from 'components/LanguagePicker';
import UserDropdown from 'components/UserDropdown';
import { useParams, usePathname } from 'next/navigation';
import ArrowDown from 'assets/svg/chevron-down.svg';
import './style.scss';

const NavConfig = [
  {
    label: 'Đề thi',
    route: '/exam',
  },
  {
    label: 'Câu hỏi',
    route: '/question',
    children: [
      {
        label: 'Câu hỏi',
        route: '/question',
      },
      {
        label: 'Tạo  câu hỏi',
        route: '/question/question-form',
      },
    ],
  },
  {
    label: 'Flash card',
    route: '/flash-card',
  },
  {
    label: 'Blog',
    route: '/blog',
    children: [
      {
        label: 'Blogs',
        route: '/blog',
      },
      {
        label: 'Quản lý blog',
        route: '/blog/blog-management',
      },
      {
        label: 'Tạo blog',
        route: '/blog/blog-form',
      },
    ],
  },
  {
    label: 'Thanh toán',
    route: '/payment',
    children: [
      {
        label: 'Thanh toán',
        route: '/payment',
      },
      {
        label: 'Lịch sử thanh toán',
        route: '/payment/history',
      },
    ],
  },
];
const Header = () => {
  const { data } = useSession();
  const { lng } = useParams();
  const pathName = usePathname();

  return (
    <header className="header h-[6rem] w-full  px-4 flex justify-between items-center shadow-sm">
      <div>Japanese Example</div>
      <nav className="h-full flex items-center">
        {NavConfig.map((item, idx) => (
          <div className={`relative h-full nav `} key={idx}>
            <Link
              className={` px-2 md:px-4 xl:px-8 mx-2 h-full flex  items-center text-[1.2rem] lg:text-base font-medium text-gray-500 hover:text-primary ${
                pathName.startsWith(`/${lng}/customer${item.route}`)
                  ? 'text-primary '
                  : ''
              }`}
              href={`/${lng}/customer${item.route}`}
            >
              {item.label}
              {item.children?.length && <ArrowDown className="ml-1" />}
            </Link>
            {item.children?.length && (
              <div className="absolute nav-menu top-full left-0 flex min-w-full z-10  bg-white flex-col gap-4 border rounded-md p-5 shadow-lg border-gray-200">
                {item.children.map((subRoute, idx) => (
                  <Link
                    className="text-gray-600 hover:text-primary-500 "
                    key={idx}
                    href={`/${lng}/customer${subRoute.route}`}
                  >
                    {subRoute.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
