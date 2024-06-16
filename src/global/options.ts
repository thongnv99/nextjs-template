import { QUESTION_LEVEL, QUESTION_TYPE } from './common';

export const QuestionTypeOptions = [
  {
    label: 'J_86',
    value: '',
  },
  {
    label: 'J_209',
    value: QUESTION_TYPE.MULTIPLE_CHOICE,
  },
  {
    label: 'J_10',
    value: QUESTION_TYPE.FILL_IN_THE_BLANK,
  },
  {
    label: 'J_9',
    value: QUESTION_TYPE.ESSAY,
  },
];
export const LevelTypeOptions = [
  {
    label: 'J_86',
    value: '',
  },
  {
    label: 'J_245',
    value: QUESTION_LEVEL.EASY,
  },
  {
    label: 'J_246',
    value: QUESTION_LEVEL.MEDIUM,
  },
  {
    label: 'J_247',
    value: QUESTION_LEVEL.HARD,
  },
];
export const SampleOptions = [
  {
    label: 'J_86',
    value: '',
  },
  {
    label: 'J_43',
    value: 'true',
  },
  {
    label: 'J_244',
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
