import {
  CONTEST_HISTORY_STATUS,
  QUESTION_LEVEL,
  QUESTION_TYPE,
  ROLES,
} from './common';

export const QUESTION_TYPE_TRANSLATE: Record<string, string> = {
  [QUESTION_TYPE.ESSAY]: 'J_9',
  [QUESTION_TYPE.FILL_IN_THE_BLANK]: 'J_10',
  [QUESTION_TYPE.MULTIPLE_CHOICE]: 'J_11',
};

export const ROLES_TRANSLATE: Record<string, string> = {
  [ROLES.ADMIN]: 'J_12',
  [ROLES.STAFF]: 'J_13',
  [ROLES.USER_FREE]: 'J_14',
  [ROLES.USER_PREMIUM]: 'J_15',
};

export const LEVEL_TRANSLATE: Record<string, string> = {
  [QUESTION_LEVEL.EASY]: 'Dễ',
  [QUESTION_LEVEL.MEDIUM]: 'Trung bình',
  [QUESTION_LEVEL.HARD]: 'Khó',
};

export const QUESTION_STATUS_TRANSLATE: Record<string, string> = {
  CORRECT: 'Đúng',
  INCORRECT: 'Sai',
};

export const CONTEST_HISTORY_STATUS_TRANSLATE: Record<string, string> = {
  [CONTEST_HISTORY_STATUS.DOING]: 'Đang làm bài',
  [CONTEST_HISTORY_STATUS.MARK_PENDING]: 'Chờ chấm điểm',
  [CONTEST_HISTORY_STATUS.OVERTIME]: 'Quá thời gian',
  [CONTEST_HISTORY_STATUS.CHEAT]: 'Phát hiện gian lận',
  [CONTEST_HISTORY_STATUS.FINISHED]: 'Hoàn thành',
};
