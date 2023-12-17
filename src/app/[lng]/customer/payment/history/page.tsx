'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import BadgeCell from 'components/DataGrid/BadgeCell';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import React, { useRef } from 'react';
import { PAYMENT_QUERY_HISTORY } from 'store/key';
import { fetcher } from 'utils/restApi';
const PaymentHistoryPage = () => {
  const gridRef = useRef<DataGridHandle>();
  const { trigger: requestData } = useMutation<{
    items: Record<string, unknown>[];
  }>(PAYMENT_QUERY_HISTORY, {
    url: '/api/v1/paymentHistories',
    method: METHOD.GET,
    onSuccess(data) {
      console.log({ data });
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.applyTransaction({
        add: data.result?.items,
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
    },
  });
  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên gói',
      flex: 1,
      field: 'packageId',
      cellClass: 'bold',
    },
    {
      headerName: 'Tổng tiền thanh toán',
      flex: 1,
      field: 'totalCharge',
    },
    {
      headerName: 'Phương thức thanh toán',
      flex: 1,
      field: 'paymentMethodId',
    },
    {
      headerName: 'Trạng thái',
      flex: 1,
      field: 'status',
      cellRenderer: BadgeCell,
      cellRendererParams: {
        dot: true,
        colorClass: {
          PENDING: 'bg-yellow-50 text-yellow-500',
          CONFIRMING: 'bg-primary-50 text-primary-500',
          SUCCESS: 'bg-green-50 text-green-500',
          FAILED: 'bg-red-50 text-red-500',
        },
      },
    },
  ];

  const handleRequest = () => {
    // gridRef.current?.api?.showLoadingOverlay();
    // requestData();
    gridRef.current?.api?.applyTransaction({
      add: [{}, {}],
      addIndex: gridRef.current.api.getDisplayedRowCount(),
    });
  };

  const datasource: IDatasource = {
    getRows(params) {
      const filter = params.filterModel;
      const sort = params.sortModel;
    },
  };

  return (
    <div className="h-full w-full border border-gray-50 rounded-lg flex flex-col shadow-sm">
      <div className="px-5 py-6">
        <div className="text-lg font-semibold">Lịch sử thanh toán</div>
      </div>
      <div>Filter</div>
      <div className="flex-1">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          headerHeight={44}
          rowHeight={72}
          onGridReady={handleRequest}
          rowModelType="infinite"
        />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
