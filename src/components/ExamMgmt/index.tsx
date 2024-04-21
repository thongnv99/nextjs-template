'use client';
import Loader from 'components/Loader';
import QuestionItem from 'components/QuestionItem';
import React, { useEffect, useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
import Plus from 'assets/svg/plus.svg';
import { FETCH_COUNT, METHOD, QUESTION_TYPE, ROLES } from 'global';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { ExamRes, IExam, Pagination, QuestionRes } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import ExamItem from 'components/ExamItem';
import ModalProvider from 'components/ModalProvider';
import ExamForm from 'components/ExamForm';
import PaginationBar from 'components/PaginationBar';
import { useTranslation } from 'app/i18n/client';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from 'react-window';
import EmptyData from 'components/EmptyData';
import { Formik } from 'formik';
import TextInput from 'elements/TextInput';
import Dropdown from 'elements/Dropdown';
import { SampleOptions } from 'global/options';

type Props = { compact?: boolean };
interface ExamFilter {
  searchKey: string;
  sample: string;
}
const ExamMgmt = ({ compact }: Props) => {
  const { t } = useTranslation();
  const componentId = useRef(uuid());
  const [examModal, setExamModal] = useState<{ show: boolean; data?: IExam }>({
    show: false,
  });
  const { data: filterCached, mutate: saveFilter } =
    useSWR<ExamFilter>('EXAM_FILTER');
  const filter = useRef<ExamFilter>(
    filterCached ?? { searchKey: '', sample: '' },
  );
  const [data, setData] = useState<IExam[]>([]);
  const pagination = useRef<Pagination>({
    page: 0,
    limit: FETCH_COUNT,
    totalPage: 1,
  });

  const { data: session } = useSession();
  const loading = useRef(false);

  const { trigger, isMutating } = useMutation<ExamRes>('/api/v1/exams', {
    url: '/api/v1/exams',
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
      const { searchKey, sample } = filter.current;
      trigger({
        page: page + 1,
        limit: FETCH_COUNT,
        ...(!isBlank(searchKey) && {
          searchKey,
        }),
        ...(!isBlank(sample) && {
          isSample: sample === 'true',
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
    console.log({ item });
    return (
      <div style={style} className="py-[2px] flex items-center  px-5">
        <ExamItem
          compact={compact}
          key={item.id}
          data={item}
          onRefresh={handleRefresh}
        />
      </div>
    );
  };

  return (
    <Loader
      id={componentId.current}
      loading={isMutating}
      className="h-full w-full border border-gray-200 rounded-lg bg-white flex flex-col shadow-sm"
    >
      <div className="p-5 pb-0 flex items-center justify-between">
        <div className="text-lg font-semibold">{t('J_39')}</div>
        {!compact &&
          (!process.env.LOCK_CREATE_EXAM ||
            [ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role)) && (
            <button
              type="button"
              className="btn-primary btn-icon"
              onClick={handleCreateExam}
            >
              <Plus /> {t('J_40')}
            </button>
          )}
      </div>
      {!compact && (
        <Formik
          onSubmit={values => {
            filter.current = values;
            saveFilter(values);
            handleRefresh();
          }}
          initialValues={filter.current}
        >
          {({ values, setFieldValue, handleSubmit }) => {
            return (
              <form
                onSubmit={handleSubmit}
                className="px-5 mb-4 flex gap-2 items-end"
              >
                <div className="max-w-lg flex-1">
                  <TextInput
                    label="Tìm kiếm"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    className="w-full"
                    value={values.searchKey}
                    name="searchKey"
                    onChange={e => {
                      setFieldValue('searchKey', e.target.value);
                    }}
                  />
                </div>
                <div className="max-w-lg flex-1">
                  <Dropdown
                    label="Đề thi mẫu"
                    placeholder="Đề thi mẫu"
                    className="w-full"
                    options={SampleOptions}
                    selected={values.sample}
                    onChange={value => {
                      setFieldValue('sample', value);
                      handleSubmit();
                    }}
                  />
                </div>
                <div>
                  <button className="btn-primary !h-[4.1rem]" type="submit">
                    Tìm kiếm
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
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

                      // listRef.current = list;
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
        <ExamForm
          onClose={() => setExamModal({ show: false })}
          onRefresh={handleRefresh}
        />
      </ModalProvider>
    </Loader>
  );
};

export default ExamMgmt;
