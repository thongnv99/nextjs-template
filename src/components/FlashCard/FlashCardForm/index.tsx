import { useTranslation } from 'app/i18n/client';
import Editor from 'components/Editor';
import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IFlashCard } from 'interfaces';
import React, { useRef } from 'react';
import { useSWRConfig } from 'swr';
import { isBlank, uuid } from 'utils/common';

type FlashCardFormProps = {
  data?: IFlashCard; // for edit
  onClose(): void;
  onRefresh(): void;
};

interface FlashCardInput {
  question: string;
  answer: string;
}

const FlashCardForm = (props: FlashCardFormProps) => {
  const componentId = useRef(uuid());
  const { t } = useTranslation();
  const { trigger: createFlashCard } = useMutation(
    'FLASH_CARD_CREATE_FLASH_CARD',
    {
      url: '/api/v1/flashcards',
      method: METHOD.POST,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'J_188',
        content: 'J_189',
      },
      onSuccess() {
        props.onClose();
        props.onRefresh();
      },
    },
  );
  const { trigger: updateFlashCard } = useMutation(
    'FLASH_CARD_UPDATE_FLASH_CARD',
    {
      url: '/api/v1/flashcards/{flashcardId}',
      method: METHOD.PUT,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'J_190',
        content: 'J_191',
      },
      onSuccess() {
        props.onClose();
        props.onRefresh();
      },
    },
  );
  const handleSubmit = (values: FlashCardInput) => {
    if (props.data) {
      updateFlashCard({
        ...values,
        flashcardId: props.data.id,
      });
    } else {
      createFlashCard(values as unknown as Record<string, unknown>);
    }
  };
  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">{t('J_192')}</div>
        <div className="text-sm font-normal text-gray-500">{t('J_193')}</div>
      </div>
      <Formik
        initialValues={{
          question: props.data?.question ?? '',
          answer: props.data?.answer ?? '',
        }}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          touched,
          errors,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-container mb-4">
              <label className="input-label">{t('J_3')}</label>
              <Editor
                data={values.question}
                onChange={data => setFieldValue('question', data)}
              />
            </div>
            <TextInput
              label="J_194"
              name="answer"
              className="mb-8"
              onChange={handleChange}
              value={values.answer}
              onBlur={handleBlur}
              hasError={touched.answer && !isBlank(errors.answer)}
              errorMessage={errors.answer}
            />
            <div className="flex gap-3">
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

export default FlashCardForm;
