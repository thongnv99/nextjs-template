export interface RestError {
  status: boolean;
  code?: string;
  message?: string;
  messageParams?: Record<string, unknown>;
}

export interface RestSuccess<T = Record<string, unknown>> {
  status: boolean;
  result?: T;
}

type RestResponse<T = Record<string, unknown>> = RestError | RestSuccess<T>;
