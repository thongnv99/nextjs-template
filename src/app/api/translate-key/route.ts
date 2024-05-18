import { NextResponse } from 'next/server';

export const GET = async () => {
  const vi = require('../../i18n/locales/vi/translation.json');
  const ja = require('../../i18n/locales/ja/translation.json');
  const dump = require('./dump.json');

  const keys = Object.keys(vi);
  const data: Record<string, string>[] = [];

  keys.forEach(key => {
    data.push({
      key,
      vi: vi[key] || '',
      ja: ja[key] || '',
    });
  });
  const viData: Record<string, string> = {};

  Object.keys(dump).forEach(key => {
    const item = dump[key];
    viData[item['Key']] = item['JA'];
  });

  return NextResponse.json(data);
};
