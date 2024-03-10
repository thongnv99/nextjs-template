'use client';
import React from 'react';
import { RadioGroup as RadioGroupCmp } from '@headlessui/react';
import './style.scss';
import { useTranslation } from 'app/i18n/client';
interface RadioGroupProps {
  value?: string | number;
  onChange?(value: string | number): void;
  options?: { label: string; value: string }[];
  labelClassName?: string;
  className?: string;
}

const RadioGroup = (props: RadioGroupProps) => {
  const { t } = useTranslation();
  return (
    <RadioGroupCmp
      className={`flex radio-group w-full ${props.className ?? ''}`}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options?.map(item => (
        <RadioGroupCmp.Option
          key={item.value}
          as="div"
          className=" flex-1 flex items-center mr-5 cursor-pointer radio-option"
          value={item.value}
        >
          {({ checked }) => (
            <>
              <div
                className={` ${
                  checked ? 'checked' : ''
                } bg-clip-content p-[2px] border-2 radio-input border-solid w-[2rem] aspect-square rounded-full  mr-3`}
              ></div>
              <div className={`radio-label  ${props.labelClassName ?? ''}`}>
                {t(item.label)}
              </div>
            </>
          )}
        </RadioGroupCmp.Option>
      ))}
    </RadioGroupCmp>
  );
};

export default RadioGroup;
