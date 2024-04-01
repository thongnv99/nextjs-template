'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import Loader from 'components/Loader';
import React, { useRef } from 'react';
import InfoUser from 'components/InfoUser';
import { uuid } from 'utils/common';
import InfoUserPoint from 'components/InfoUser/Point';
import ExamSummaryChart from 'components/ExamSummaryChart';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import Filter from 'assets/svg/Filters lines.svg';
import ActionIcon from 'components/InfoUser/ActionIcon';
import GroupButton from 'components/GroupButton';
import { useMutation } from 'hooks/swr';
import { METHOD } from 'global';
import { dateTimeFormatter } from 'utils/grid';
import { differenceInMinutes, subMinutes } from 'date-fns';

const CompetitionHistory = (props: { params: { contestId: string } }) => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const { trigger: requestData } = useMutation<{
    items: Record<string, unknown>[];
  }>('/api/v1/examHistories', {
    url: '/api/v1/examHistories',
    method: METHOD.GET,
    onSuccess(data) {
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.applyTransaction({
        add: data?.items,
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
    },
  });

  const data1: [string, number][] = [
    ['Trung bình', 60],
    ['Khá', 30],
    ['Giỏi', 10],
  ];
  const data2: [string, number][] = [
    ['Đúng ', 60],
    ['Sai', 30],
    ['Không trả lời', 10],
  ];

  // function refreshData() {
  //   gridRef.current?.api?.updateGridOptions({ rowData: [] });
  // }
  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên ',
      flex: 1,
      field: 'name',
      cellClass: 'bold',
      cellRenderer: InfoUser,
      cellRendererParams: (params: any) => {
        return {
          name: `${params?.data?.userId?.firstName ?? ''}  ${
            params?.data?.userId?.lastName ?? ''
          }`,
          email: params?.data?.userId?.email,
        };
      },
    },
    {
      headerName: 'Điểm số',
      flex: 1,
      field: 'score',
      cellRenderer: InfoUserPoint,
      cellRendererParams: (params: any) => {
        return {
          point: params?.data.score,
        };
      },
    },
    {
      headerName: 'Thời gian thi',
      flex: 1,
      field: 'startTime',
      valueFormatter: dateTimeFormatter,
    },
    {
      headerName: 'Thời gian làm bài',
      flex: 1,
      field: 'forTime',
      valueFormatter: params => {
        const startTime = params.data.startTime;
        const endTime = params.data.endTime;
        if (startTime && endTime) {
          const minutes = differenceInMinutes(
            new Date(startTime as number),
            new Date(endTime as number),
          );
          return `${minutes} Phút`;
        }
        return 'Đang làm bài';
      },
    },
    {
      headerName: '',
      flex: 0.1,
      cellRenderer: ActionIcon,
      cellRendererParams: {},
    },
  ];

  const handleRequest = (e: any) => {
    gridRef.current?.api?.showLoadingOverlay();
    requestData({
      source: 'CONTEST',
      contestId: props.params.contestId,
    });
  };

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border border-gray-200 rounded-lg flex flex-col shadow-sm p-1"
    >
      <div className="px-5 py-3 text-lg font-semibold gap-x-3 flex items-center">
        Lịch sử cuộc thi{' '}
        <span className="text-[1.2rem] text-[var(--brand-800)] bg-[var(--gray-50)] rounded-full px-[1rem]">
          240 người tham gia
        </span>
      </div>
      <div className="flex  justify-evenly">
        <ExamSummaryChart data={data1} />
        <ExamSummaryChart data={data2} />
      </div>
      <div className="w-full my-4 flex justify-between">
        <GroupButton />
        <div className="flex gap-x-1">
          <TextInput
            leadingIcon={<Search />}
            placeholder="Search"
            inputClass="!py-2"
          />
          <button className="btn flex items-center gap-x-2" type="button">
            <Filter />
            Filter
          </button>
        </div>
      </div>
      <div className="flex-1">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          headerHeight={44}
          suppressCellFocus
          rowHeight={50}
          onGridReady={handleRequest}
        />
      </div>
    </Loader>
  );
};
export default CompetitionHistory;
