import { LANG } from 'global';
import { IBlog } from 'interfaces';
import React from 'react';
import { getBlogDetail, getBlogs } from 'services/common';
import { decodeUrl, encodeUrl } from 'utils/common';
import { formatDateToString } from 'utils/datetime';

interface BlogDetailProps {
  params: {
    blogId: string;
  };
}

const BlogDetail = async (props: BlogDetailProps) => {
  const id = decodeUrl(props.params.blogId);
  const res = await getBlogDetail(id ?? '');

  if (!res.status || res.result == null) {
    return <div>Có lỗi xảy ra :{res.message}</div>;
  }
  const data = res.result;
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

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map(item => encodeUrl(item, LANG.VI));
}
