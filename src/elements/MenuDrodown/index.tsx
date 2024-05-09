'use client';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'app/i18n/client';
import React, { Fragment, MouseEventHandler } from 'react';

type MenuDropdown = {
  buttonRender: React.FunctionComponent;
  options: {
    label: string;
    onClick: MouseEventHandler;
    hide?: boolean;
  }[];

  header?: string;
};

const MenuDropdown = (props: MenuDropdown) => {
  const { t } = useTranslation();
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className=" flex gap-2 items-center">
            <props.buttonRender />
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
            {props.header && (
              <div className="px-1 py-1 ">
                <Menu.Item>
                  <div
                    className={`${'text-gray-900'}  text-center font-bold group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {t(props.header)}
                  </div>
                </Menu.Item>
              </div>
            )}
            {props.options.map((item, idx) => {
              if (item.hide) {
                return null;
              }
              return (
                <div className="px-1 py-1 " key={idx}>
                  <Menu.Item>
                    <button
                      onClick={item.onClick}
                      className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {t(item.label)}
                    </button>
                  </Menu.Item>
                </div>
              );
            })}
            {/* <div className="px-1 py-1 ">
                <Menu.Item>
                  <button
                    onClick={handleShowProfileForm}
                    className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <UserIcon className="mr-2 h-5 w-5" />
                    {t('J_16')}
                  </button>
                </Menu.Item>
              </div> */}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default MenuDropdown;
