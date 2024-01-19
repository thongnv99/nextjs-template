export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export enum ROLES {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER_FREE = 'USER_FREE',
  USER_PREMIUM = 'USER_PREMIUM',
}

export enum ROUTES {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
}

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum LANG {
  VI = 'vi',
  EN = 'en',
}

export enum FLASH_CARD_STATUS {
  UNREVIEW = 'UNREVIEW',
  REVIEWED = 'REVIEWED',
  REVIEW_AGAIN = 'REVIEW_AGAIN',
}

export enum QUESTION_TYPE {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
  ESSAY = 'ESSAY',
}

export enum QUESTION_LEVEL {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}
//Status COMPETITION
export enum COMPETITION_STATUS {
  HAPPENNING='HAPPENNING',
  END='END'
}

export enum EXAM_STATUS {
  UPCOMING='UPCOMING',
  HAPPENNING='HAPPENNING',
  COMPLETE='COMPLETE',
  CANCEL='CANCEL'
}