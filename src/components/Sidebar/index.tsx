'use client';
import { useTranslation } from 'app/i18n/client';
import { getRoutesConfig } from 'components/config';
import Home from 'assets/svg/home.svg';
import ArrowDown from 'assets/svg/chevron-down.svg';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useParams, usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const { t } = useTranslation();
  const { data } = useSession();
  const { lng } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (route: string) => {
    router.push(`/${lng}${route}`);
  };
  return (
    <nav className="h-full w-full p-4 flex flex-col gap-2">
      {getRoutesConfig(data?.user.role).map((route, idx) => {
        const Icon = route.icon ?? Home;
        const isActive = pathname.startsWith(`/${lng}${route.route}`);
        return (
          <div
            className={`h-[4rem] p-2 flex items-center gap-2 
            hover:bg-primary-100 hover:text-primary-500
             cursor-pointer rounded-md
             ${isActive ? '!bg-primary-100 !text-primary-500' : ''}
             `}
            key={idx}
            onClick={() => handleClick(route.route)}
          >
            <div
              className={`${isActive ? 'text-primary-500' : 'text-gray-400'}`}
            >
              <Icon />
            </div>
            <div className="font-semibold">{t(route.label)}</div>
            {route.children && (
              <div className="ml-auto">
                <ArrowDown />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Sidebar;
