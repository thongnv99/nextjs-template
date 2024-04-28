'use client';
import React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import LanguagePicker from 'components/LangPicker';
import UserDropdown from 'components/UserDropdown';
import Logo from 'assets/svg/logo.svg';
import { useTranslation } from 'app/i18n/client';
import './style.scss';
import { useSession } from 'next-auth/react';
import Menu from 'assets/svg/menu-2.svg';
import { toggleMenu } from 'utils/common';

const Header = () => {
  const { lng } = useParams();
  const router = useRouter();
  const { status } = useSession();
  return (
    <header className="header h-[6rem] w-full  px-4 flex justify-between items-center border-b border-b-gray-200">
      <div
        className="h-full py-2 cursor-pointer"
        onClick={() => {
          router.push(`/${lng}/home`);
        }}
      >
        <Logo className="h-full w-auto" />
      </div>
      <div className=" flex items-center  divide-x">
        <div className="mr-4 h-fit md:flex hidden">
          <LanguagePicker />
        </div>
        {status === 'authenticated' ? (
          <div className="pl-4 md:flex hidden items-center justify-center">
            <UserDropdown />
          </div>
        ) : (
          <div className="pl-4">
            <Link
              href={`/${lng}/login`}
              className="btn-primary !h-[3rem] flex items-center"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
      {status === 'authenticated' && (
        <div
          onClick={toggleMenu}
          className="cursor-pointer flex md:hidden items-center justify-center "
        >
          <Menu />
        </div>
      )}
    </header>
  );
};

export default Header;
