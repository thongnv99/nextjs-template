'use client';
import BlogDetail from 'components/BlogDetail';
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

  return <BlogDetail data={data} />;
};

export default BlogDetailPage;
