'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useEffect, useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import { FETCH_COUNT, METHOD, QUESTION_TYPE, ROLES } from 'global';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import {
  ContestRes,
  ExamRes,
  IContest,
  IExam,
  Pagination,
  QuestionRes,
} from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import ContestItem from 'components/ContestItem';
import ModalProvider from 'components/ModalProvider';
import ContestForm from 'components/ContestForm';
import PaginationBar from 'components/PaginationBar';
import { useUserInfo } from 'hooks/common';
import useSWR from 'swr';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from 'react-window';
import EmptyData from 'components/EmptyData';
import { useTranslation } from 'app/i18n/client';
interface ContestFilter {
  searchKey: string;
}
const ContestMgmt = ({
  compact,
  inPicker,
  onSelect,
}: {
  compact?: boolean;
  inPicker?: boolean;
  onSelect?: (exam: IContest) => void;
}) => {
  const { data: userInfo } = useUserInfo();
  const componentId = useRef(uuid());
  const [examModal, setExamModal] = useState<{ show: boolean; data?: IExam }>({
    show: false,
  });
  const { t } = useTranslation();
  const { data: filterCached, mutate: saveFilter } =
    useSWR<ContestFilter>('CONTEST_FILTER');
  const filter = useRef<ContestFilter>(filterCached ?? { searchKey: '' });
  const [data, setData] = useState<IContest[]>([]);
  const pagination = useRef<Pagination>({
    page: 0,
    limit: FETCH_COUNT,
    totalPage: 1,
  });
  const loading = useRef(false);

  const { trigger, isMutating } = useMutation<ContestRes>('/api/v1/contests', {
    url: '/api/v1/contests',
    method: METHOD.GET,
    onSuccess(data, key, config) {
      setData(prev => [...prev, ...data.items]);
      pagination.current = data.pagination;
      loading.current = false;
    },
  });

  useEffect(() => {
    requestData();
  }, []);

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      loading.current = true;
      const { searchKey } = filter.current;
      trigger({
        page: page + 1,
        limit: FETCH_COUNT,
        ...(!isBlank(searchKey) && {
          searchKey,
        }),
      });
    }
  };

  const handleCreateExam = () => {
    setExamModal({ show: true });
    // router.push(`/${lng}/question/question-form`);
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
        <ContestItem
          compact={compact}
          key={item.id}
          data={item}
          onRefresh={handleRefresh}
          onSelect={onSelect}
          inPicker={inPicker}
        />
      </div>
    );
  };
  return (
    <Loader
      id={componentId.current}
      loading={isMutating}
      className={`h-full flex-1 w-full  bg-white  flex flex-col ${
        !inPicker ? 'border border-gray-200 rounded-lg shadow-sm ' : ''
      } `}
    >
      {!inPicker && (
        <div className="px-5 py-6 flex items-center justify-between">
          <div className="text-lg font-semibold">
            {t(compact ? 'J_2' : 'J_141')}
          </div>
          {!compact && [ROLES.ADMIN, ROLES.STAFF].includes(userInfo?.user.role)  && (
            <button
              type="button"
              className="btn-primary btn-icon"
              onClick={handleCreateExam}
            >
              <Plus /> {t('J_140')}
            </button>
          )}
        </div>
      )}
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
                    }}
                    itemData={data}
                    itemSize={() => 70}
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
          <EmptyData type="empty" onClick={handleRefresh} />
        )}
      </div>

      <ModalProvider
        show={examModal.show}
        onClose={() => setExamModal({ show: false })}
      >
        <ContestForm
          onClose={() => setExamModal({ show: false })}
          onRefresh={handleRefresh}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ContestMgmt;
