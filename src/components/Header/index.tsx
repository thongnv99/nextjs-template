'use client';
import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import LanguagePicker from 'components/LangPicker';
import UserDropdown from 'components/UserDropdown';
import ArrowDown from 'assets/svg/chevron-down.svg';
import Logo from 'assets/svg/logo.svg';
import { useTranslation } from 'app/i18n/client';
import './style.scss';

const Header = () => {
  const { lng } = useParams();
  const pathName = usePathname();
  const { t } = useTranslation();

  return (
    <header className="header h-[6rem] w-full  px-4 flex justify-between items-center border-b border-b-gray-200">
      <div className="h-full py-2">
        <Logo className="h-full w-auto" />
      </div>
      {/* <nav className="h-full flex items-center">
        {ROUTES_CONFIG.map((item, idx) => (
          <div className={`relative h-full nav `} key={idx}>
            <Link
              className={` px-2 md:px-4 xl:px-8 mx-2 h-full flex  items-center text-[1.2rem] lg:text-base font-medium text-gray-500 hover:text-primary ${
                pathName.startsWith(`/${lng}/customer${item.route}`)
                  ? 'text-primary '
                  : ''
              }`}
              href={`/${lng}/customer${item.route}`}
            >
              {t(item.label)}
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
                    {t(subRoute.label)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav> */}
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
