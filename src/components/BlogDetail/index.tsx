import { IBlog } from 'interfaces';
import React from 'react';
import { formatDateToString } from 'utils/datetime';

interface BlogDetailProps {
  data: IBlog;
}

const BlogDetail = ({ data }: BlogDetailProps) => {
  return (
    <div className="w-full m-auto max-w-screen-md items-center flex flex-col px-6 pt-[9.6rem]">
      <div className="mb-[9.6rem] flex flex-col gap-3 items-center">
        <div className="text-[4.8rem] font-bold text-gray-900 ">
          {data.title}
        </div>
        <div className="text-base font-normal text-gray-500 ">
          {formatDateToString(new Date(data.createdAt), 'dd/MM/yyyy')}
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
    </div>
  );
};

export default BlogDetail;
