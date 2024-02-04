import { IBlog, IFlashCard, IQuestion } from './model';

export interface RestError {
  status: number;
  code?: string;
  message?: string;
  messageParams?: Record<string, unknown>;
}

export interface RestSuccess<T = Record<string, unknown>> {
  status: number;
  result?: T;
}

export type RestResponse<T = Record<string, unknown>> = RestError &
  RestSuccess<T>;

export interface ArrayResponse<T> {
  items: T[];
}

export interface PaymentPackageRes {
  id: string;
  name: string;
  type: string;
  price: number;
  discount: number;
}

export interface CategoryQuestionRes {
  id: string;
  name: string;
  description: string;
}

export interface PaymentMethodRes {
  items: {
    id: number;
    name: string;
    params: {
      banks?: {
        accountName: string;
        accountNumber: string;
        bankCode: string;
        bankName: string;
      }[];
    };
  }[];
}

export interface IExam {
  id: string;
  title: string;
  description: string;
  isSample: boolean;
  parts: {
    duration: number;
    questions: IQuestion[];
  }[];
  createdAt: number;
}

export interface ICompetition {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  parts: {
    duration: number;
    questions: string[];
  }[];
  status: string;
}
export type BlogListRes = ArrayResponse<IBlog>;

export type FlashCardRes = ArrayResponse<IFlashCard>;
export type QuestionRes = ArrayResponse<IQuestion>;
export type ExamRes = ArrayResponse<IExam>;
export type CompetitionRes = ArrayResponse<ICompetition>;
