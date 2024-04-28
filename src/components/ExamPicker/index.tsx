import { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import CheckIcon from 'assets/svg/check-icon.svg';
import Chevron from 'assets/svg/chevron-down.svg';
import { useSWRWrapper } from 'hooks/swr';
import { ExamRes, IExam, QuestionRes } from 'interfaces';
import Clear from 'assets/svg/x.svg';
type ExamPickerProps = {
  placeholder?: string;
  selected?: IExam | null;
  onChange?: (value?: IExam | null) => void;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
};

export default function ExamPicker(props: ExamPickerProps) {
  const [selected, setSelected] = useState<IExam | null>(
    props.selected || null,
  );
  const [query, setQuery] = useState('');
  const { label, hasError, errorMessage, className } = props;
  const { data, isLoading, mutate } = useSWRWrapper<ExamRes>(`/api/v1/exams`, {
    url: '/api/v1/exams',
    params: {
      page: 1,
      limit: 200,
    },
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (selected) {
      setQuery(selected.title);
    } else {
      setQuery('');
    }
    props.onChange?.(selected);
  }, [selected]);

  const filteredExam =
    query === ''
      ? data?.items
      : data?.items.filter(exam =>
          exam.title
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  return (
    <div
      className={`dropdown-container ${className ?? ''}  ${
        hasError ? 'has-error' : ''
      }`}
    >
      {label != null && (
        <label className="dropdown-label" htmlFor="">
          {label}
        </label>
      )}
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative flex-1 w-full">
          <div className="dropdown-button flex gap-2 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="flex-1 outline-none border-none text-sm leading-5 text-gray-900 "
              value={query}
              placeholder={props.placeholder}
              onChange={event => setQuery(event.target.value)}
            />
            {selected && (
              <button
                className="flex items-center"
                onClick={() => setSelected(null)}
              >
                <Clear />
              </button>
            )}
            <Combobox.Button className="flex items-center">
              <Chevron className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-20 mt-1 max-h-[40rem] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredExam?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredExam?.map(person => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {person.title}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {props.hasError && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}
