import { FLASH_CARD_STATUS, QUESTION_LEVEL, QUESTION_TYPE } from 'global';

export interface NotificationConfig {
  title?: string;
  ignoreSuccess?: boolean;
  ignoreError?: boolean;
  type?: 'TOAST' | 'MODAL';
  content?: string;
}

export interface IGlobalClient {}

export interface IBlog {
  id: string;
  content: string;
  title: string;
  description?: string;
  status: 'PUBLISH' | 'DRAFT';
  createdAt: number;
  createdBy?: {
    email: string;
    id: string;
    name?: string;
    phoneNumber?: string;
  };
}

export interface IFlashCard {
  id: string;
  question: string;
  answer: string;
  status: FLASH_CARD_STATUS;
}

export interface IQuestion {
  id: string;
  type: QUESTION_TYPE;
  level: QUESTION_LEVEL;
  content: string;
  isSample?: boolean;
  answerExplain?: string;
  correctOption?: string;
  options?: string[];
  score: number;
  duration?: number;
  year?: string;
  questionCategoryId?: {
    id: string;
    name?: {
      vi?: string;
      ja?: string;
    };
  };
  source?: string;
  createdAt: number;
  answer?: string | string[];
  blankPositions?: { answer: string }[];
  userAnswer?: string;
  adminNote?: string;
  adminScore?: string;
  status: 'INCORRECT' | 'CORRECT';
  tags: string;
  isMultiChoice?: boolean;
}

export interface IResponseDefault {
  items: [];
  pagination: {};
}
