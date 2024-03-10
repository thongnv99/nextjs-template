'use client';
import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { LANG } from 'global';
import VI from 'assets/svg/vi-flag.svg';
import JA from 'assets/svg/ja-flag.svg';

const LangConfig = [
  { name: 'Tiếng Việt', value: LANG.VI, icon: <VI /> },
  { name: 'Tiếng Nhật', value: LANG.JA, icon: <JA /> },
];

const LangPicker = (props: { isMobile?: boolean }) => {
  const { lng } = useParams();
  const pathName = usePathname();
  const [selected, setSelected] = useState(
    LangConfig.find(item => item.value === lng) || LangConfig[0],
  );
  const router = useRouter();
  const changeLang = (lang: LANG) => {
    const path = String(pathName).slice(3);
    router.push(`/${lang}${path}`);
  };

  if (props.isMobile) {
    return (
      <div className="flex gap-[1.6rem] items-center">
        <div className="text-white">Ngôn ngữ:</div>
      </div>
    );
  }

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1 mr-2 md:mr-0">
        <Listbox.Button
          id="list-box"
          className="relative w-full !bg-transparent sm:text-sm flex flex-row items-center justify-center"
        >
          <div className="border border-primary-400 shadow-sm">
            {selected.icon}
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-[10] mt-1 max-h-60 p-[0.8rem] gap-[0.8rem]  flex flex-col right-0 top-full w-[23rem] overflow-auto rounded-[1.6rem] bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {LangConfig.map((lang, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative cursor-pointer flex items-center gap-[4px] justify-start select-none p-[1.2rem] rounded-[0.8rem] ${
                    active || selected.value === lang.value
                      ? ' bg-[#EAF0FF]'
                      : ''
                  }`
                }
                value={lang}
                onClick={() => changeLang(lang.value)}
              >
                {lang.icon}
                <span className={`block text-[1.6rem] text-[#324165]`}>
                  {lang.name}
                </span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default LangPicker;
