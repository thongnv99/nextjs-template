'use client';
import TextInput from 'elements/TextInput';
import { Formik, FormikProps } from 'formik';
import React, { useRef } from 'react';
import './style.scss';
import Dropdown from 'elements/Dropdown';
import { QUESTION_LEVEL, QUESTION_TYPE } from 'global';
import { isBlank, uuid } from 'utils/common';
import { useCategoryQuestions } from 'hooks/common';
import Checkbox from 'elements/CheckBox';
import Delete from 'assets/svg/delete.svg';
import Plus from 'assets/svg/plus-square.svg';
import Editor from 'components/Editor';
import { useCreateQuestionMutation } from './mutation';
import Loader from 'components/Loader';

const BLANK_DETECT = `<span class="mention" data-mention="[(n)]">[(n)]</span>`;

interface QuestionFormValues {
  title?: string;
  content?: string;
  answerExplain?: string;
  options: string[];
  blanks: Record<string, string>;
  blankPositions: string[];
  correctOption?: string;
  questionCategoryId?: string;
  type: QUESTION_TYPE;
  level: QUESTION_LEVEL;
  score?: number;
  duration?: number;
}

const QuestionTypeOptions = [
  {
    label: 'Trắc nghiệm',
    value: QUESTION_TYPE.MULTIPLE_CHOICE,
  },
  {
    label: 'Điền vào chỗ trống',
    value: QUESTION_TYPE.FILL_IN_THE_BLANK,
  },
  {
    label: 'Tự luận',
    value: QUESTION_TYPE.ESSAY,
  },
];

const LevelOptions = [
  {
    label: 'Dễ',
    value: QUESTION_LEVEL.EASY,
  },
  {
    label: 'Trung bình',
    value: QUESTION_LEVEL.MEDIUM,
  },
  {
    label: 'Khó',
    value: QUESTION_LEVEL.HARD,
  },
];

const QuestionForm = () => {
  const componentId = useRef(uuid());
  const { trigger } = useCreateQuestionMutation({
    onSuccess: () => {
      formRef.current?.resetForm();
    },
    componentId: componentId.current,
  });
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<FormikProps<QuestionFormValues>>();

  const handleSubmit = (values: QuestionFormValues) => {
    let payload = {} as Record<string, unknown>;
    if (values.type === QUESTION_TYPE.ESSAY) {
      payload = {
        type: values.type,
        level: values.level,
        questionCategoryId: values.questionCategoryId,
        source: 'QUESTION',
        content: values.content,
        answer: 'Tự chấm',
      };
    } else if (values.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      payload = {
        type: values.type,
        level: values.level,
        questionCategoryId: values.questionCategoryId,
        source: 'QUESTION',
        content: values.content,
        correctOption: values.correctOption,
        options: values.options,
      };
    } else {
      const container = document.createElement('div');
      container.innerHTML = values.content ?? '';
      const codes = container.getElementsByTagName('code');
      const blankPositions: Record<string, string>[] = [];
      for (let i = 0; i < codes.length; i++) {
        const mention = codes.item(i);
        if (mention) {
          blankPositions.push({ answer: mention.innerHTML });
        }
      }
      payload = {
        type: values.type,
        level: values.level,
        questionCategoryId: values.questionCategoryId,
        source: 'QUESTION',
        content: values.content,
        blankPositions: blankPositions ?? [],
      };
    }

    trigger(payload);
  };

  const handleSaveClick = () => {
    formRef.current?.submitForm();
  };

  const { data: categoryOptions } = useCategoryQuestions();
  return (
    <Loader id={componentId.current} className="base-container question-form">
      <div className="base-top-container">
        <div className="base-title">Tạo mới câu hỏi</div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveClick}
          >
            Tạo mới
          </button>
          <button type="button" className="btn">
            Hủy
          </button>
        </div>
      </div>
      <div className="base-bottom-container">
        <Formik
          onSubmit={handleSubmit}
          innerRef={instance => (formRef.current = instance!)}
          initialValues={{
            level: QUESTION_LEVEL.EASY,
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            options: ['', '', ''],
            content: '',
            correctOption: '0',
            blanks: {},
            blankPositions: ['', '', ''],
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            setFieldValue,
            handleSubmit,
          }) => (
            <form className="w-full h-full flex gap-8" onSubmit={handleSubmit}>
              <div className="question-section w-[35%]">
                <div className="title">Cài đặt</div>
                <div className="flex flex-col gap-2">
                  <TextInput
                    label="Điểm"
                    name="score"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hasError={touched.score && !isBlank(errors.score)}
                    errorMessage={errors.score}
                    value={values.score}
                    type="number"
                  />
                  <TextInput
                    label="Thời gian làm bài (phút)"
                    name="duration"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hasError={touched.duration && !isBlank(errors.duration)}
                    errorMessage={errors.duration}
                    value={values.duration}
                    type="number"
                  />
                  <Dropdown
                    options={LevelOptions}
                    selected={values.level}
                    label="Level"
                    onChange={value => setFieldValue('level', value)}
                  />
                  <Dropdown
                    options={categoryOptions?.items.map(item => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    placeholder="Phân loại câu hỏi"
                    selected={values.questionCategoryId}
                    label="Phân loại"
                    initial
                    onChange={value =>
                      setFieldValue('questionCategoryId', value)
                    }
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 pb-4 overflow-x-hidden">
                <div className="question-section">
                  <div className="flex items-center justify-between mb-4">
                    <div className="title !mb-0">Câu hỏi</div>
                    <div>
                      <Dropdown
                        options={QuestionTypeOptions}
                        selected={values.type}
                        onChange={value => setFieldValue('type', value)}
                        menuAlignRight
                      />
                    </div>
                  </div>
                  <div className="w-full min-h-[10rem]">
                    <Editor
                      data={values.content}
                      onChange={value => setFieldValue('content', value)}
                      placeholder="Nhập nội dung câu hỏi"
                    />
                  </div>
                  {values.type === QUESTION_TYPE.FILL_IN_THE_BLANK && (
                    <>
                      <div className="ck-content mt-4">
                        <strong>Hướng dẫn: </strong> Nhập nội dung câu hỏi, bôi
                        đen phần muốn thay thế bằng chỗ trống và chọn biểu tượng{' '}
                        <code>{`<>`}</code>trên toolbar{' '}
                      </div>
                    </>
                  )}
                </div>
                {values.type === QUESTION_TYPE.MULTIPLE_CHOICE && (
                  <div className="question-section">
                    <div className="title">Đáp án</div>
                    <div ref={optionsRef} className="flex flex-col gap-4  mb-4">
                      {values.options.map((item, idx) => (
                        <div className="flex items-center gap-2" key={idx}>
                          <Checkbox
                            selected={values.correctOption === String(idx)}
                            onChange={(_, value) =>
                              setFieldValue('correctOption', String(idx))
                            }
                          />
                          <div className="uppercase">
                            {String.fromCharCode(65 + idx)}.
                          </div>
                          <TextInput
                            value={item}
                            name={`options[${idx}]`}
                            id={`options[${idx}]`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="flex-1"
                          />
                          <Delete
                            className="text-gray-500 cursor-pointer"
                            onClick={() => {
                              const cpyOptions = [...values.options];
                              cpyOptions.splice(idx, 1);
                              setFieldValue('options', cpyOptions);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('options', [...values.options, '']);
                          setTimeout(() => {
                            const inputs =
                              optionsRef.current?.getElementsByTagName('input');
                            const lastInput = inputs?.item(inputs.length - 1);
                            lastInput?.focus();
                          }, 200);
                        }}
                        className="btn"
                      >
                        Thêm đáp án
                      </button>
                    </div>
                    <div className="text-right">
                      <span>
                        (*) Chọn <strong>đáp án đúng</strong> bằng cách Click
                        vào ô vuông cạnh đáp án
                      </span>
                    </div>
                  </div>
                )}

                {values.type === QUESTION_TYPE.MULTIPLE_CHOICE && (
                  <div className="question-section">
                    <div className="title">Giải thích đáp án</div>
                    <TextInput
                      label="Giải thích đáp án"
                      type="textarea"
                      name="answerExplain"
                      placeholder="Giải thích đáp án"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.answerExplain}
                    />
                  </div>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Loader>
  );
};

export default QuestionForm;
