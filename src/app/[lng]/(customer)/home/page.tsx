import React from 'react';
import Info from 'assets/svg/info.svg';
import ExamHistory from 'components/ExamHistory';
import ContestMgmt from 'components/ContestMgmt';
import ExamMgmt from 'components/ExamMgmt';

const HomePage = () => {
  return (
    <div className="h-full gap-8 w-full  rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-blue-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              Cuộc thi đã tham gia <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">10</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-red-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              Đề thi đã làm <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">15</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-yellow-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              Câu hỏi
              <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">100</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-green-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              Flash Card <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">1000</div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="flex-1 h-full ">
          <ContestMgmt compact />
        </div>
        <div className="flex-1 h-full ">
          <ExamMgmt compact />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
