'use client';
import TextInput from 'elements/TextInput';
import { Formik } from 'formik';
import React, { useRef } from 'react';
import './style.scss';
import Dropdown from 'elements/Dropdown';
import { QUESTION_LEVEL, QUESTION_TYPE } from 'global';
import { isBlank } from 'utils/common';
import { useCategoryQuestions } from 'hooks/common';
import Checkbox from 'elements/CheckBox';
import Delete from 'assets/svg/delete.svg';
import Plus from 'assets/svg/plus-square.svg';

interface QuestionFormValues {
  title?: string;
  options: string[];
  correctOption?: string;
  questionCategoryId?: string;
  type: QUESTION_TYPE;
  level: QUESTION_LEVEL;
  score?: number;
  duration?: number;
}

const TypeOptions = [
  {
    label: 'Trắc nghiệm',
    value: QUESTION_TYPE.MULTIPLE_CHOICE,
  },
  {
    label: 'Điền vào chỗ trống',
    value: QUESTION_TYPE.FILL_IN_THE_BLANK,
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
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (values: QuestionFormValues) => {
    console.log(values);
  };

  const { data: categoryOptions } = useCategoryQuestions();
  return (
    <div className="base-container question-form">
      <div className="base-top-container">
        <div className="base-title">Tạo mới câu hỏi</div>
        <div className="flex gap-2">
          <button type="button" className="btn-primary">
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
          initialValues={{
            level: QUESTION_LEVEL.EASY,
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            options: ['', '', ''],
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
              <div className="flex-1 flex flex-col gap-4">
                <div className="question-section">
                  <div className="title">Câu hỏi</div>
                  <TextInput
                    label="Nội dung câu hỏi"
                    type="textarea"
                    placeholder="Nhập nội dung câu hỏi"
                  />
                </div>
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
                      (*) Chọn <strong>đáp án đúng</strong> bằng cách Click vào
                      ô vuông cạnh đáp án
                    </span>
                  </div>
                </div>
                <div className="question-section">
                  <div className="title">Giải thích đáp án</div>
                  <TextInput
                    label="Nội dung câu hỏi"
                    type="textarea"
                    placeholder="Nhập nội dung câu hỏi"
                  />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QuestionForm;
