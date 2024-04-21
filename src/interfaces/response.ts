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
  pagination: Pagination;
}

export interface Pagination {
  limit: number;
  totalPage: number;
  page: number;
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
  name: {
    vi: string;
    ja: string;
  };
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
  duration: number;
  order?: number;
  isSample: boolean;
  parts: IPart[];
  createdAt: number;
}

export interface IContest {
  id: string;
  title: string;
  description: string;
  duration: number;
  startTime: number;
  endTime: number;
  status: string;
  createdAt: number;
  order?: number;
  password?: string;
  hasPassword?: boolean;
  parts: IPart[];
}
export interface IPart {
  duration: number;
  questions: IQuestion[];
  startIdx?: number;
  name?: string;
}

export type BlogListRes = ArrayResponse<IBlog>;

export type FlashCardRes = ArrayResponse<IFlashCard>;
export type QuestionRes = ArrayResponse<IQuestion>;
export type ExamRes = ArrayResponse<IExam>;
export type ContestRes = ArrayResponse<IContest>;

export interface DoExamRes {
  sessionId: string;
  startTime: number;
  status: string;
  totalQuestion: number;
  totalScore: number;
  parts: IPart[];
}

export interface SubmitExamRes {
  id: string;
  startTime: number;
  endTime: number;
  status: string;
  totalQuestion: number;
  totalScore: number;
  totalQuestionAchieved: number;
  totalScoreAchieved: number;
  statAnswer?: {
    total: number;
    totalCorrect: number;
    totalIncorrect: number;
    totalNotAnswer: number;
  };
  statScore?: {
    total: number;
    totalCorrect: number;
    totalIncorrect: number;
    totalNotAnswer: number;
  };
  parts: string;
}

export interface StatsRes {
  contest: {
    totalCompleted: number;
    totalSessionCompleted: number;
    totalTimeCompleted: number;
  };
  exam: {
    totalCompleted: number;
    totalSessionCompleted: number;
    totalTimeCompleted: number;
  };
  flashcard: {
    totalLearned: number;
    totalUnlearned: number;
  };
}
