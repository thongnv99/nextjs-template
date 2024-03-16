'use client';
import React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import LanguagePicker from 'components/LangPicker';
import UserDropdown from 'components/UserDropdown';
import Logo from 'assets/svg/logo.svg';
import { useTranslation } from 'app/i18n/client';
import './style.scss';

const Header = () => {
  const { lng } = useParams();
  const router = useRouter();
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
