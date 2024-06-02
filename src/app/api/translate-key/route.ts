import { NextResponse } from 'next/server';

export const GET = async () => {
  const dump = require('./dump.json');

  const data: Record<string, string>[] = [];

  const viData: Record<string, string> = {};

  Object.keys(dump).forEach(key => {
    const item = dump[key];
    viData[item['Key']] = item['JA'];
  });

  return NextResponse.json(viData);
};
