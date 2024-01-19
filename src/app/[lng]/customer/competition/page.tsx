import Loader from 'components/Loader';
import React, { useRef, useState } from 'react';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import CompetitionStart from 'components/CompetitionStart/page';

const Competition = () => {
  const competitionData=[
    {
      id:1,
      time:'20h',
      status:'HAPPENNING'
    },
    {
      id:2,
      time:'22h',
      status:'END'
    }
  ]
  return (
    <Loader className="h-full w-full border border-gray-200 rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm px-10 ">
      <div className=" flex items-center justify-between pt-5 ">
        <div className="text-lg font-semibold">Danh sách cuộc thi</div>
      </div>
      <div className="max-w-lg my-4">
        <TextInput leadingIcon={<Search />} placeholder="Search" />
      </div>
      <div className="gap-y-5">
        {
          competitionData.map((item)=>(
            <CompetitionStart key={item.id} competition={item}/>
          ))
        }
        
        {/* <CompetitionEnd /> */}
      </div>
    </Loader>
  );
};
export default Competition;
