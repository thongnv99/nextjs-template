import { LANG } from 'global';
import { IBlog } from 'interfaces';

export const isBlank = (str?: string | null): boolean => {
  return str == null || /^\s*$/.test(str);
};

export const uuid = (a?: number): string => {
  if (a != null) {
    return (a ^ ((Math.random() * 16) >> (a / 4))).toString(16);
  } else {
    // eslint-disable-next-line
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
  }
};

export const formatNumber = (
  value?: number,
  digit?: number,
  offsetRate?: number,
  toFixed?: boolean,
  failoverValue = '0',
  isSkipRound?: boolean,
  floor?: boolean,
) => {
  if (value == null || isNaN(value)) {
    return failoverValue;
  }

  let data = value;

  if (offsetRate != null) {
    data = value / offsetRate;
  }

  let tempValueString = data.toString();
  let prefix = '';

  if (tempValueString[0] === '-') {
    prefix = '-';
    tempValueString = tempValueString.substring(1, tempValueString.length);
  }

  try {
    const tempValue = Number(tempValueString);
    let fractionDigit = 0;
    if (digit != null) {
      fractionDigit = digit;
    }
    if (fractionDigit > 0) {
      const mainNum = Number(
        `${Number(tempValue.toString())}e+${fractionDigit}`,
      );
      const temp = +`${
        isSkipRound
          ? mainNum
          : floor
          ? Math.floor(mainNum)
          : Math.round(mainNum)
      }e-${fractionDigit}`;
      let fractionString = '';
      let i = '';
      if (toFixed === true) {
        i = temp.toFixed(fractionDigit);
        fractionString = i.substring(i.indexOf('.'), i.length);
        i = i.substring(0, i.indexOf('.'));
      } else {
        i = temp.toString();
        if (temp.toString().indexOf('.') >= 1) {
          fractionString = temp
            .toString()
            .substring(temp.toString().indexOf('.'), temp.toString().length);
          i = temp.toString().substring(0, temp.toString().indexOf('.'));
        }
      }
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fractionString;
    } else {
      const mainNum = Number(
        `${Number(tempValue.toString())}e+${fractionDigit}`,
      );
      const temp = +`${
        isSkipRound
          ? mainNum
          : floor
          ? Math.floor(mainNum)
          : Math.round(mainNum)
      }e-${fractionDigit}`;
      const i = temp.toString();
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  } catch {
    return '';
  }
};

export const dataURLtoFile = (data: string, filename: string) => {
  const arr = data.split(','),
    mime = arr[0]?.match(/:(.*?);/)?.[1],
    bstr = atob(arr[arr.length - 1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const vietnameseWithoutAccent = (alias: string) => {
  let str = alias;
  const UpperCase = [];
  for (let i = 0; i < alias.length; i++) {
    if (alias[i] === alias[i].toUpperCase()) {
      UpperCase.push(i);
    }
  }
  str = alias.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/ + /g, ' ');
  str = str.trim();

  let result = '';

  for (let i = 0; i < str.length; i++) {
    if (UpperCase.includes(i)) {
      result += str[i].toUpperCase();
    } else {
      result += str[i];
    }
  }
  return result;
};

// encode decode
export const encodeUrl = (blog?: IBlog, lng?: LANG) => {
  const title =
    lng == LANG.JA && !isBlank(blog?.title) ? blog?.title : blog?.title;

  return `${vietnameseWithoutAccent(title ?? '')
    .toLowerCase()
    .replaceAll('"', '')
    .replaceAll(' ', '-')}-${blog?.id}`;
};

export const decodeUrl = (url: string) => {
  return url.split('-').pop();
};

export const toggleMenu = () => {
  if (window.innerWidth < 768) {
    const menu = document.getElementById('sidebar');
    menu?.classList.toggle('show');
  }
};
