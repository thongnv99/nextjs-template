'use client';
import TextInput from 'elements/TextInput';
import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef } from 'react';
import './style.scss';
import Dropdown from 'elements/Dropdown';
import { METHOD, QUESTION_LEVEL, QUESTION_TYPE } from 'global';
import { isBlank, uuid } from 'utils/common';
import { useCategoryQuestions } from 'hooks/common';
import Checkbox from 'elements/CheckBox';
import Delete from 'assets/svg/delete.svg';
import Plus from 'assets/svg/plus-square.svg';
import Editor from 'components/Editor';
import {
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
} from './mutation';
import Loader from 'components/Loader';
import { useSWRWrapper } from 'hooks/swr';
import { IQuestion } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';

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
  source?: string;
  duration?: number;
  year?: string;
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

interface QuestionFormProps {
  questionId?: string; // for edit or duplicate
  isEdit?: boolean;
}

const QuestionForm = (props: QuestionFormProps) => {
  const router = useRouter();
  const componentId = useRef(uuid());
  const { lng } = useParams();
  const { data } = useSWRWrapper<IQuestion>(
    props.questionId ? `/api/v1/questions/${props.questionId}` : null,
    {
      url: `/api/v1/questions/${props.questionId}`,
      method: METHOD.GET,
    },
  );

  const { trigger: createQuestion } = useCreateQuestionMutation({
    onSuccess: () => {
      if (props.questionId) {
        router.back();
        return;
      }
      formRef.current?.resetForm();
    },
    componentId: componentId.current,
  });
  const { trigger: updateQuestion } = useUpdateQuestionMutation({
    onSuccess: () => {
      router.back();
    },
    componentId: componentId.current,
  });
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<FormikProps<QuestionFormValues>>();

  useEffect(() => {
    if (data) {
      const values: QuestionFormValues = {
        type: data.type,
        level: data.level,
        score: data.score,
        source: data.source,
        content: data.content,
        duration: data.duration,
        year: data.year,
        answerExplain: data.answerExplain,
        questionCategoryId: data.questionCategoryId?.id,
        options: data.options ?? [],
        blanks: {},
        correctOption: String(data.correctOption),
        blankPositions: [],
      };
      if (values.type === QUESTION_TYPE.FILL_IN_THE_BLANK) {
        const container = document.createElement('div');
        container.innerHTML = values.content ?? '';
        const codes = container.getElementsByTagName('code');
        for (let i = 0; i < codes.length; i++) {
          const mention = codes.item(i);
          if (mention) {
            mention.innerHTML = data.blankPositions?.[i].answer ?? '';
          }
        }
        values.content = container.innerHTML;
      }
      formRef.current?.setValues({
        ...formRef.current.values,
        ...values,
      });
    }
  }, [data]);

  const handleSubmit = (values: QuestionFormValues) => {
    let payload = {} as Record<string, unknown>;
    if (values.type === QUESTION_TYPE.ESSAY) {
      payload = {
        type: values.type,
        level: values.level,
        year: values.year,
        score: values.score,
        questionCategoryId: values.questionCategoryId,
        source: 'QUESTION',
        content: values.content,
        answer: 'Tự chấm',
      };
    } else if (values.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      payload = {
        type: values.type,
        score: values.score,
        level: values.level,
        year: values.year,
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
          mention.innerHTML = `[(${i + 1})]`;
        }
      }
      payload = {
        type: values.type,
        score: values.score,
        level: values.level,
        year: values.year,
        questionCategoryId: values.questionCategoryId,
        source: 'QUESTION',
        content: container.innerHTML,
        blankPositions: blankPositions ?? [],
      };
    }

    if (props.isEdit) {
      updateQuestion({
        ...payload,
        questionId: props.questionId,
        type: null,
        source: null,
      });
    } else {
      createQuestion(payload);
    }
  };

  const handleSaveClick = () => {
    formRef.current?.submitForm();
  };

  const { data: categoryOptions } = useCategoryQuestions();
  return (
    <Loader
      id={componentId.current}
      className="base-container question-form bg-white"
    >
      <div className="base-top-container">
        <div className="base-title">
          {props.isEdit ? 'Cập nhật câu hỏi' : 'Tạo mới câu hỏi'}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveClick}
          >
            {props.isEdit ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              router.back();
            }}
          >
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
            options: ['', '', '', ''],
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
                    label="Năm"
                    name="year"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hasError={touched.year && !isBlank(errors.year)}
                    errorMessage={errors.year}
                    value={values.year}
                  />
                  <Dropdown
                    options={LevelOptions}
                    selected={values.level}
                    label="Level"
                    onChange={value => setFieldValue('level', value)}
                  />
                  <Dropdown
                    options={categoryOptions?.items.map(item => ({
                      label: item.name[lng as 'vi' | 'ja'],
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
                    {props.questionId == null && (
                      <div>
                        <Dropdown
                          options={QuestionTypeOptions}
                          selected={values.type}
                          onChange={value => setFieldValue('type', value)}
                          menuAlignRight
                        />
                      </div>
                    )}
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
                          <div className="uppercase">{idx + 1}.</div>
                          {/* <TextInput
                            value={item}
                            name={`options[${idx}]`}
                            id={`options[${idx}]`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="flex-1"
                          /> */}
                          <div className="flex-1 min-h-[10rem] overflow-hidden">
                            <Editor
                              data={item}
                              id={`options[${idx}]`}
                              key={`options[${idx}]`}
                              onChange={value =>
                                setFieldValue(`options[${idx}]`, value)
                              }
                              placeholder="Nhập đáp án"
                            />
                          </div>
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
                    <div className="w-full min-h-[10rem]">
                      <Editor
                        data={values.answerExplain}
                        id={`answerExplain`}
                        key={`answerExplain`}
                        onChange={value =>
                          setFieldValue(`answerExplain`, value)
                        }
                        placeholder="Giải thích đáp án"
                      />
                    </div>
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
