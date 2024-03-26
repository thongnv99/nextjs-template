import { QUESTION_TYPE } from './common';

export const QuestionTypeOptions = [
  {
    label: 'Tất cả',
    value: '',
  },
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

export const SampleOptions = [
  {
    label: 'Tất cả',
    value: '',
  },
  {
    label: 'Câu hỏi mẫu',
    value: 'true',
  },
  {
    label: 'Câu hỏi thường',
    value: 'false',
  },
];

export const YearOptions = new Array(20).fill(0).map((_, idx) => {
  const year = new Date().getFullYear() - idx;
  return {
    label: String(year),
    value: String(year),
  };
});
