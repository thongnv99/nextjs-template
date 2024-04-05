'use client';
import BlogDetail from 'components/BlogDetail';
import BlogList from 'components/BlogList';
import Preload from 'components/Preload';
import { useBlog } from 'hooks/common';
import React from 'react';
import { decodeUrl } from 'utils/common';

interface BlogDetailProps {
  params: {
    blogId: string;
  };
}

const BlogDetailPage = (props: BlogDetailProps) => {
  const id = decodeUrl(props.params.blogId);
  const { data, error, isLoading } = useBlog(id!);

  if (isLoading) {
    return <Preload />;
  }

  if (data == null) {
    return <div>Đã có lỗi xảy ra</div>;
  }

  return (
    <div className="flex items-start h-full">
      {/* <div className="w-[30%] h-full">
        <BlogList inDetail />
      </div> */}
      <BlogDetail data={data} />
    </div>
  );
};

export default BlogDetailPage;
