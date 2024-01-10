'use client';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import CheckIcon from 'assets/svg/check.svg';
import ChevronDown from 'assets/svg/chevron-down.svg';
import { useTranslation } from 'app/i18n/client';
import './style.scss';
type DropdownProps = {
  options?: DropdownOption[];
  placeholder?: string;
  selected?: string;
  onChange?: (value: string) => void;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  initial?: boolean;
  menuAlignRight?: boolean;
};

interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const Dropdown = (props: DropdownProps) => {
  const { t } = useTranslation();
  const [mapLabel, setMapLabel] = useState<Record<string, string>>({});
  const { label, hasError, errorMessage, className } = props;

  const [selected, setSelected] = useState<string | undefined>(
    props.options?.find(item => item.value === props.selected)?.value,
  );

  useEffect(() => {
    if (props.selected !== selected) {
      setSelected(props.selected);
    }
  }, [props.selected]);

  useEffect(() => {
    const mapRecord: Record<string, string> = {};
    props.options?.forEach(option => {
      mapRecord[option.value] = option.label;
    });
    setMapLabel(mapRecord);
    if (props.initial && props.options?.length) {
      const active = props.options?.find(item => item.value === props.selected);
      if (active == null) {
        handleChange(props.options[0].value);
      }
    }
  }, [props.options]);

  const handleChange = (value: string) => {
    setSelected(value);
    props.onChange?.(value);
  };
  return (
    <div
      className={`dropdown-container ${className ?? ''}  ${
        hasError ? 'has-error' : ''
      }`}
    >
      {label != null && (
        <label className="dropdown-label" htmlFor="">
          {t(label!)}
        </label>
      )}
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-full">
          <Listbox.Button className="dropdown-button">
            <span className="block truncate font-normal">
              {mapLabel[selected ?? ''] ?? props.placeholder ?? ''}
            </span>
            <span className=" ">
              <ChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute mt-1 max-h-60 min-w-full !w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10 ${
                props.menuAlignRight ? 'right-0' : ''
              }`}
            >
              {props.options?.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {props.hasError && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Dropdown;
