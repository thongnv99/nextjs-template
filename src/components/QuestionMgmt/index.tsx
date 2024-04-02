'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useEffect, useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import Dropdown from 'elements/Dropdown';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { IQuestion, Pagination, QuestionRes } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import {
  QuestionTypeOptions,
  SampleOptions,
  YearOptions,
} from 'global/options';
import { FETCH_COUNT, METHOD } from 'global';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from 'react-window';
import QuestionPicker from 'components/QuestionPicker';
import ExamPicker from 'components/ExamPicker';
type Props = {
  inPicker?: boolean;
  onRowCheckedChange?: (data: IQuestion, value?: boolean) => void;
};

const QuestionMgmt = (props: Props) => {
  const componentId = useRef(uuid());
  const router = useRouter();
  const { lng } = useParams();
  const [type, setType] = useState('');
  const [sample, setSample] = useState('');
  const [year, setYear] = useState('');
  const [mapChecked, setMapChecked] = useState<Record<string, boolean>>({});

  const [data, setData] = useState<IQuestion[]>([]);
  const loading = useRef(false);
  const pagination = useRef<Pagination>({
    page: 0,
    limit: FETCH_COUNT,
    totalPage: 1,
  });

  const { trigger, isMutating } = useMutation<QuestionRes>(
    '/api/vi/questions',
    {
      url: '/api/v1/questions',
      method: METHOD.GET,
      onSuccess(data, key, config) {
        setData(prev => [...prev, ...data.items]);
        pagination.current = data.pagination;
        loading.current = false;
      },
    },
  );

  useEffect(() => {
    requestData();
  }, []);
  useEffect(() => {
    handleRefresh();
  }, [sample, type, year]);

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      loading.current = true;
      trigger({
        page: page + 1,
        limit: FETCH_COUNT,
        ...(!isBlank(type) && {
          type,
        }),
        ...(!isBlank(sample) && {
          isSample: sample === 'true',
        }),
        ...(!isBlank(year) && {
          year,
        }),
      });
    }
  };

  const handleCreateQuestion = () => {
    router.push(`/${lng}/question/question-form`);
  };

  const handleRefresh = () => {
    pagination.current = {
      page: 0,
      limit: FETCH_COUNT,
      totalPage: 1,
    };
    setData([]);
    requestData();
  };

  const isItemLoaded = (index: number) => {
    return data[index] != null;
  };

  const loadMoreItems = () => {
    return new Promise<void>(() => {
      if (!loading.current) {
        requestData();
      }
    });
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = data![index];
    return (
      <div style={style} className="py-[2px] flex items-center  px-5">
        <QuestionItem
          data={item}
          checked={mapChecked[item.id]}
          onRefresh={handleRefresh}
          showCheckBox={props.inPicker}
          hideAction={props.inPicker}
          onRowCheckedChange={(question, value) => {
            props.onRowCheckedChange?.(question, value);
            setMapChecked(prev => ({ ...prev, [String(question.id)]: value! }));
          }}
        />
      </div>
    );
  };

  return (
    <Loader
      id={componentId.current}
      loading={isMutating && !data.length}
      className={`h-full w-full  bg-white  flex flex-col ${
        !props.inPicker ? 'border border-gray-200 rounded-lg shadow-sm ' : ''
      } `}
    >
      {!props.inPicker && (
        <>
          <div className="p-5 pb-0 flex items-center justify-between">
            <div className="text-lg font-semibold">Danh sách câu hỏi</div>
            <button
              type="button"
              className="btn-primary btn-icon"
              onClick={handleCreateQuestion}
            >
              <Plus /> Thêm câu hỏi
            </button>
          </div>
        </>
      )}
      <div className="px-5 mb-4 flex gap-2">
        <div className="max-w-lg flex-1">
          <Dropdown
            label="Loại câu hỏi"
            placeholder="Loại câu hỏi"
            className="w-full"
            options={QuestionTypeOptions}
            selected={type}
            onChange={value => setType(value)}
          />
        </div>
        <div className="max-w-lg flex-1">
          <Dropdown
            label="Câu hỏi mẫu"
            placeholder="Câu hỏi mẫu"
            className="w-full"
            options={SampleOptions}
            selected={sample}
            onChange={value => setSample(value)}
          />
        </div>
        <div className="max-w-lg flex-1">
          <Dropdown
            label="Năm"
            placeholder="Năm"
            className="w-full"
            options={YearOptions}
            selected={year}
            onChange={value => setYear(value)}
          />
        </div>
        <div className="max-w-lg flex-1">
          <ExamPicker label="Đề thi" placeholder="Đề thi" className="w-full" />
        </div>
      </div>
      <div className="  pb-5 flex-1 w-full flex flex-col gap-2 ">
        {data && data.length > 0 ? (
          <AutoSizer className="list">
            {({ width, height }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={Number.MAX_SAFE_INTEGER}
                loadMoreItems={loadMoreItems}
                threshold={20}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    height={height}
                    onItemsRendered={onItemsRendered}
                    ref={list => {
                      // eslint-disable-next-line
                      (ref as Function)(list);

                      // listRef.current = list;
                    }}
                    itemData={data}
                    itemSize={() => 88}
                    itemCount={data.length}
                    width={width}
                  >
                    {Row}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        ) : (
          <div className="empty">Không có dữ liệu</div>
        )}
      </div>
      <div></div>
    </Loader>
  );
};

export default QuestionMgmt;
