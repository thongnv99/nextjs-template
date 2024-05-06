'use client';
import React from 'react';
import Info from 'assets/svg/info.svg';
import ContestMgmt from 'components/ContestMgmt';
import ExamMgmt from 'components/ExamMgmt';
import { useSWRWrapper } from 'hooks/swr';
import { StatsRes } from 'interfaces';
import { formatNumber } from 'utils/common';
import { useTranslation } from 'app/i18n/client';

const HomePage = () => {
  const { t } = useTranslation();
  const { data } = useSWRWrapper<StatsRes>('/api/v1/users/stats', {
    url: '/api/v1/users/stats',
  });

  return (
    <div className="md:h-full gap-8 w-full  rounded-lg max-w-screen-lg m-auto flex flex-col shadow-sm">
      <div className="grid grid-cols-1  md:grid-cols-4 gap-4">
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-blue-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              {t('J_44')} <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">
              {formatNumber(data?.contest.totalSessionCompleted ?? 0)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-red-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              {t('J_45')} <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">
              {formatNumber(data?.exam.totalSessionCompleted)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-yellow-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              {t('J_46')}
              <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">
              {formatNumber((data?.exam.totalTimeCompleted ?? 0) / 60 / 60)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-green-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-base flex gap-2 items-center">
              {t('J_47')} <Info className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="font-bold text-lg">
              {formatNumber(data?.flashcard.totalLearned)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex-col md:flex-row flex gap-4 overflow-hidden ">
        <div className="flex-1 flex flex-col h-full min-h-[50vh]">
          <ContestMgmt compact />
        </div>
        <div className="flex-1 flex flex-col h-full min-h-[50vh]">
          <ExamMgmt compact />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
