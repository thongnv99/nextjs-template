'use client';
import { IBlog } from 'interfaces';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { formatDateToString } from 'utils/datetime';

interface BlogDetailProps {
  data: IBlog;
}

const BlogDetail = ({ data }: BlogDetailProps) => {
  const { lng } = useParams();
  return (
    <div className="w-full h-full  mx-auto max-w-screen-md items-center flex flex-col ">
      <span className="w-full mb-4">
        <Link className="cursor-pointer" href={`/${lng}/blog`}>
          Blog
        </Link>{' '}
        / <span className="italic text-gray-500">{data.title}</span>
      </span>
      <div className="bg-white shadow-md rounded-md p-8 h-full">
        <div className="mb-[9.6rem] flex flex-col gap-3 items-center">
          <h1 className="text-[3.2rem] font-bold text-gray-900 ">
            {data.title}
          </h1>
          <div className="text-base font-normal text-gray-500 ">
            {formatDateToString(new Date(data.createdAt), 'dd/MM/yyyy')}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      </div>
    </div>
  );
};

export default BlogDetail;
