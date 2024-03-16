'use client';
import PercentChart from 'components/PercentChart';
import { differenceInMinutes } from 'date-fns';
import { IExam, IPart, SubmitExamRes } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { formatDateToString } from 'utils/datetime';
import DoQuestion from '../DoQuestion';

type Props = {
  data?: SubmitExamRes;
  exam?: IExam;
};

const ExamResult = ({ data, exam }: Props) => {
  const { lng } = useParams();
  const router = useRouter();
  const parts = JSON.parse(data?.parts as string) as IPart[];
  return (
    <div>
      <div className=" w-full p-4 max-w-screen-lg rounded-md border border-gray-200 m-auto bg-white">
        <h1 className="text-center text-[3rem]">Kết quả</h1>
        <div className="flex w-full justify-between">
          <div className="mb-8  p-4 flex flex-col gap-4 flex-1">
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Tên đề thi</div>
              <div>{exam?.title}</div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian bắt đầu
              </div>
              <div>
                {data?.startTime
                  ? formatDateToString(
                      new Date(data?.startTime),
                      'HH:mm:ss dd/MM/yyyy',
                    )
                  : '--'}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian kết thúc
              </div>
              <div>
                {data?.endTime
                  ? formatDateToString(
                      new Date(data?.endTime),
                      'HH:mm:ss dd/MM/yyyy',
                    )
                  : '--'}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">
                Thời gian làm bài
              </div>
              <div>
                {data?.startTime && data?.endTime
                  ? `${differenceInMinutes(data.endTime, data.startTime)} phút`
                  : ''}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Đáp án đúng</div>
              {data?.status === 'FINISHED' ? (
                <div>
                  <strong className="text-primary-900">
                    {data.statAnswer?.totalCorrect}
                  </strong>
                  /{data.statAnswer?.total}
                </div>
              ) : (
                <div>Bài thi cần thời gian để xử lý!</div>
              )}
            </div>
            <div className="flex">
              <div className="min-w-[20rem] text-gray-500">Điểm</div>
              {data?.status === 'FINISHED' ? (
                <div>
                  <strong className="text-primary-900">
                    {data.statScore?.totalCorrect}
                  </strong>
                  /{data.statScore?.total}
                </div>
              ) : (
                <div>Bài thi cần thời gian để xử lý!</div>
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <PercentChart
              options={{
                size: 90,
                borderWidth: 20,
                total: data?.statAnswer?.total ?? 0,
                value: data?.statAnswer?.totalCorrect ?? 0,
                padding: 0,
                label: 'Đáp án đúng',
              }}
            />
          </div>
        </div>
        <div className="flex w-full justify-center gap-8">
          <button
            type="button"
            className="btn mt-5 w-fit"
            onClick={() => {
              router.push(`/${lng}/exam/history/${exam?.id}`);
            }}
          >
            Lịch sử thi
          </button>
          <button
            type="button"
            className="btn-primary mt-5 w-fit"
            onClick={() => {
              router.push(`/${lng}/exam`);
            }}
          >
            Đồng ý
          </button>
        </div>
      </div>
      {/* <div>
        <div>Giải thích</div>
        <div>
          {parts?.map((part, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              {part?.questions.map((item, questionIdx) => (
                <DoQuestion
                  inResult
                  id={item.id}
                  answer={item.answer}
                  onChange={answer => {}}
                  key={questionIdx}
                  question={item}
                  idx={questionIdx + 1}
                />
              ))}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ExamResult;
