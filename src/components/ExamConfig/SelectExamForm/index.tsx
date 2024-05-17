import { Tab } from '@headlessui/react';
import { useTranslation } from 'app/i18n/client';
import ContestMgmt from 'components/ContestMgmt';
import ExamMgmt from 'components/ExamMgmt';
import ExamPicker from 'components/ExamPicker';
import Loader from 'components/Loader';
import Checkbox from 'elements/CheckBox';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IContest, IExam } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { isBlank, uuid } from 'utils/common';

type ExamFormProps = {
  onSelect(exam?: IExam, contest?: IContest): void;
  onClose(): void;
};

interface ExamSelectInput {
  exam?: IExam;
  contest?: IContest;
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SelectExamForm = (props: ExamFormProps) => {
  const { t } = useTranslation();
  const componentId = useRef(uuid());

  const handleSubmit = (values: ExamSelectInput) => {
    props.onSelect(values.exam, values.contest);
  };
  return (
    <Loader
      id={componentId.current}
      className="w-screen min-h-[70rem] max-w-screen-sm p-2 md:p-6 flex flex-col"
    >
      <div className="flex flex-col mb-2">
        <div className="text-lg font-bold text-gray-900">{t('J_163')}</div>
      </div>

      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex-1 flex flex-col gap-4">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full h-[4rem]  rounded-lg  text-sm font-medium leading-5',
                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-blue-700 text-white shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                      )
                    }
                  >
                    Đề thi
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg  text-sm font-medium leading-5',
                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-blue-700 text-white  shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                      )
                    }
                  >
                    Cuộc thi
                  </Tab>
                </Tab.List>
                <Tab.Panels className="flex-1 flex flex-col">
                  <Tab.Panel className="h-full flex-1 flex flex-col" key={0}>
                    <ExamMgmt
                      inPicker
                      onSelect={exam => {
                        setFieldValue('exam', exam);
                        setTimeout(() => {
                          handleSubmit();
                        });
                      }}
                    />
                  </Tab.Panel>
                  <Tab.Panel className="h-full flex-1 flex flex-col" key={1}>
                    <ContestMgmt
                      inPicker
                      onSelect={contest => {
                        setFieldValue('contest', contest);
                        setTimeout(() => {
                          handleSubmit();
                        });
                      }}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
            <div className="flex gap-3 mt-auto">
              <button
                type="button"
                className="btn flex-1"
                onClick={props.onClose}
              >
                {t('J_61')}
              </button>
              <button type="submit" className="btn-primary flex-1">
                {t('C_1')}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};

export default SelectExamForm;
