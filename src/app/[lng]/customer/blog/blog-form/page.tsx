'use client';
import BlogForm from 'components/BlogForm';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const CreateBlogPage = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get('id');
  useEffect(() => {
    console.log(search);
  }, [search]);

  return <BlogForm />;
};

export default CreateBlogPage;
