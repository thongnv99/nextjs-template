import { NextRequest, NextResponse } from 'next/server';
import { fetcher } from 'utils/restApi';
import { METHOD } from 'global';
import { getCsrfToken } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const session = await getServerSession(authOptions);
    console.log({ session });
    const res = await fetcher('/api/v1/upload', METHOD.POST, formData, {
      Authorization: `Bearer ${session?.token}`,
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(error, { status: 500 });
  }
}
