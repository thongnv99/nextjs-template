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

export type RestResponse<T = Record<string, unknown>> = RestError &
  RestSuccess<T>;

export interface PaymentPackageRes {
  id: string;
  name: string;
  type: string;
  price: number;
  discount: number;
}
