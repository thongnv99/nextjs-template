import * as dateFns from 'date-fns';
import { vi } from 'date-fns/locale';


export const formatDateToString = (date: Date | null | undefined, formatOutput = 'yyyyMMdd') => {
  if (date == null) {
    return null;
  }

  return dateFns.format(date, formatOutput, { locale: vi });
};

export const formatStringToDate = (stringInput: string | undefined, formatInput = 'yyyyMMdd') => {
  if (stringInput == null) {
    return new Date();
  }

  return dateFns.parse(stringInput, formatInput, new Date());
};