import { QUESTION_TYPE } from './common';

export const QUESTION_TYPE_TRANSLATE: Record<string, string> = {
  [QUESTION_TYPE.ESSAY]: 'Tự luận',
  [QUESTION_TYPE.FILL_IN_THE_BLANK]: 'Điền vào chỗ trống',
  [QUESTION_TYPE.MULTIPLE_CHOICE]: 'Trắc nhiệm',
};
