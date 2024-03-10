'use client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import UserIcon from 'assets/svg/users.svg';
import LockIcon from 'assets/svg/lock.svg';
import LogOut from 'assets/svg/log-out.svg';
import ArrowDown from 'assets/svg/chevron-down.svg';
import avatar from 'assets/png/example-avatar.png';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import ModalProvider from 'components/ModalProvider';
import ChangePassword from 'components/ChangePassword';
import ProfileModal from 'components/ProfileModal';
import { useTranslation } from 'app/i18n/client';
import { ROLES_TRANSLATE } from 'global/translate';

export const UserDropdown = () => {
  const { data } = useSession();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { t } = useTranslation();
  const handleShowPassword = () => {
    setShowPasswordForm(true);
  };
  const handleClosePassword = () => {
    setShowPasswordForm(false);
  };
  const handleShowProfileForm = () => {
    setShowProfileForm(true);
  };
  const handleCloseProfileForm = () => {
    setShowProfileForm(false);
  };
  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className=" flex gap-2 items-center">
            <Image
              src={avatar}
              alt="avatar"
              className="object-cover inline-flex w-[4rem] h-[4rem] rounded-[50%] justify-center overflow-hidden"
            />
            <div>
              <div className="font-bold">{`${data?.user.firstName ?? ''} ${
                data?.user.lastName ?? ''
              }`}</div>
              <div className="text-left text-gray-500">
                {t(ROLES_TRANSLATE[data?.user.role])}
              </div>
            </div>
            <ArrowDown />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-[25rem] z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <button
                  onClick={handleShowProfileForm}
                  className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <UserIcon className="mr-2 h-5 w-5" />
                  {t('J_16')}
                </button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1 ">
              <Menu.Item>
                <button
                  onClick={handleShowPassword}
                  className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <LockIcon className="mr-2 h-5 w-5" />
                  {t('J_17')}
                </button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1 ">
              <Menu.Item>
                <button
                  className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  {t('J_18')}
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <ModalProvider show={showProfileForm} onClose={handleCloseProfileForm}>
        <ProfileModal onClose={handleCloseProfileForm} />
      </ModalProvider>
      <ModalProvider show={showPasswordForm} onClose={handleClosePassword}>
        <ChangePassword onClose={handleClosePassword} />
      </ModalProvider>
    </div>
  );
};

export default UserDropdown;
