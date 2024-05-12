'use client';
import { useTranslation } from 'app/i18n/client';
import { METHOD } from 'global';
import { useSWRWrapper } from 'hooks/swr';
import { BlogListRes, IBlog } from 'interfaces';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { encodeUrl } from 'utils/common';
import { formatDateToString } from 'utils/datetime';

const BlogCard = ({ data }: { data: IBlog }) => {
  const { lng } = useParams();

  const tag = document.createElement('div');
  tag.innerHTML = data.content;
  const imgs = tag.getElementsByTagName('img');
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs.item(i);
    if (img) {
      const replaceChild = document.createElement('div');
      replaceChild.innerHTML = 'Hình ảnh';
      img.parentNode?.replaceChild(replaceChild, img);
    }
  }
  return (
    <Link
      href={`/${lng}/blog/${encodeUrl(data)}`}
      className="w-full p-2 md:p-6 rounded-lg shadow-sm flex flex-col bg-white border-gray-200 border cursor-pointer"
    >
      <div className=" text-[1.6rem] md:text-[2.4rem] font-bold text-black mb-4 md:mb-8 text-ellipsis w-full line-clamp-2">
        {data.title}
      </div>
      <div
        className=" text-[1.2rem] md:text-base font-normal text-[#4A4A68] mb-1 md:mb-3 text-ellipsis w-full line-clamp-[4]"
        dangerouslySetInnerHTML={{ __html: tag.innerHTML }}
      ></div>
      <div className="text-[1.2rem] md:text-base font-normal text-[#4A4A68]">
        {formatDateToString(new Date(data.createdAt), 'dd/MM/yyyy')}
      </div>
    </Link>
  );
};

const BlogList = ({ inDetail }: { inDetail?: boolean }) => {
  const { data } = useSWRWrapper<BlogListRes>('/api/v1/posts', {
    url: '/api/v1/posts',
    method: METHOD.GET,
  });
  const { status } = useSession();
  const { lng } = useParams();
  const { t } = useTranslation();
  return (
    <div className="h-full w-full flex flex-col bg-white p-2 md:p-6 rounded-lg shadow-md">
      <div className="py-2 md:py-6  flex items-center justify-between w-full ">
        <div className="text-lg font-semibold">{t('J_86')}</div>
        {status === 'authenticated' && (
          <Link
            href={`/${lng}/blog/blog-management`}
            className="text-sm text-blue-500 font-semibold"
          >
            {t('J_87')}
          </Link>
        )}
      </div>
      <div className="flex-1 w-full flex flex-col gap-6  overflow-y-auto pb-8">
        {data?.items.map(item => (
          <BlogCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
