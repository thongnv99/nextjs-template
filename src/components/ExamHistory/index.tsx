'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import { usePaymentPaidMutation } from 'components/ButtonPayment/mutations';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import BadgeCell from 'components/DataGrid/BadgeCell';
import ButtonCell from 'components/DataGrid/ButtonCell';
import Loader from 'components/Loader';
import { METHOD } from 'global';
import { usePaymentMethod, usePaymentPackages } from 'hooks/common';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { IExam } from 'interfaces';
import React, { useRef } from 'react';
import { PAYMENT_QUERY_HISTORY } from 'store/key';
import { uuid } from 'utils/common';
import { dateTimeFormatter, floatFormatter } from 'utils/grid';

const ExamHistory = (props: { examId: string }) => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const { data: examData } = useSWRWrapper<IExam>(
    `/api/v1/exams/${props.examId}`,
    {
      url: `/api/v1/exams/${props.examId}`,
    },
  );
  const { trigger: requestData } = useMutation<{
    items: Record<string, unknown>[];
  }>('/api/v1/examHistories', {
    url: '/api/v1/examHistories',
    method: METHOD.GET,
    onSuccess(data) {
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.applyTransaction({
        add: data.result?.items,
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
    },
  });

  function refreshData() {
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    handleRequest();
  }
  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Thời gian',
      width: 120,
      field: 'startTime',
      valueFormatter: dateTimeFormatter,
    },
    {
      headerName: 'Tên',
      width: 120,
      field: 'userId',
      valueFormatter: params =>
        `${params.data.userId.firstName} ${params.data.userId.lastName}`,
    },
    {
      headerName: 'Điểm số',
      flex: 1,
      field: 'totalCharge',
      valueFormatter: floatFormatter,
    },
    {
      headerName: 'Trạng thái',
      flex: 1,
      field: 'status',
      cellRenderer: BadgeCell,
      cellRendererParams: {
        dot: true,
        colorClass: {
          PENDING: 'bg-yellow-100 text-yellow-500',
          CONFIRMING: 'bg-primary-100 text-primary-500',
          SUCCESS: 'bg-green-100 text-green-500',
          FAILED: 'bg-red-100 text-red-500',
        },
      },
    },
  ];

  const handleRequest = () => {
    gridRef.current?.api?.showLoadingOverlay();
    requestData({
      source: 'EXAM',
      examId: props.examId,
    });
  };

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full  bg-white border border-gray-200 rounded-lg flex flex-col shadow-sm"
    >
      <div className="px-5 py-6">
        <div className="text-lg font-semibold">Lịch sử {examData?.title} </div>
      </div>
      <div className="flex-1">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          headerHeight={44}
          suppressCellFocus
          rowHeight={72}
          onGridReady={handleRequest}
        />
      </div>
    </Loader>
  );
};

export default ExamHistory;
