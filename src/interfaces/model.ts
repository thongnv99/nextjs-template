import { FLASH_CARD_STATUS } from 'global';

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
