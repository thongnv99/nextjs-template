import Loader from 'components/Loader';
import React, { useRef, useState } from 'react';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import CompetitionStart from 'components/CompetitionStart/page';
import CompetitionEnd from 'components/CompetitionEnd/page';

const Competition = () => {
  return (
    <Loader className="h-full w-full border border-gray-200 rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm px-10 ">
      <div className=" flex items-center justify-between pt-5 ">
        <div className="text-lg font-semibold">Danh sách cuộc thi</div>
      </div>
      <div className="max-w-lg my-4">
        <TextInput leadingIcon={<Search />} placeholder="Search" />
      </div>
      <div className="gap-y-5">
        <CompetitionStart />
        <CompetitionEnd />
      </div>
    </Loader>
  );
};
export default Competition;
