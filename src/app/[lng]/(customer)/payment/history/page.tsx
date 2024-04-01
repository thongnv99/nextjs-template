'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import { usePaymentPaidMutation } from 'components/ButtonPayment/mutations';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import BadgeCell from 'components/DataGrid/BadgeCell';
import ButtonCell from 'components/DataGrid/ButtonCell';
import Loader from 'components/Loader';
import { METHOD } from 'global';
import { usePaymentMethod, usePaymentPackages } from 'hooks/common';
import { useMutation } from 'hooks/swr';
import React, { useRef } from 'react';
import { PAYMENT_QUERY_HISTORY } from 'store/key';
import { uuid } from 'utils/common';
import { floatFormatter } from 'utils/grid';

const PaymentHistoryPage = () => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const { data: paymentMethod } = usePaymentMethod();
  const { data: paymentPackages } = usePaymentPackages();

  const { trigger: confirmPaid } = usePaymentPaidMutation(
    componentId.current,
    refreshData,
  );
  const { trigger: requestData } = useMutation<{
    items: Record<string, unknown>[];
  }>(PAYMENT_QUERY_HISTORY, {
    url: '/api/v1/paymentHistories',
    method: METHOD.GET,
    onSuccess(data) {
      console.log({ data });
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.applyTransaction({
        add: data?.items,
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
    },
  });

  function refreshData() {
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    requestData();
  }
  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên gói',
      flex: 1,
      field: 'packageId',
      cellClass: 'bold',
      valueGetter: params => {
        const payment = paymentPackages?.items?.find(
          item => item.id === params.data?.packageId,
        );
        return payment?.name ?? params.data?.packageId;
      },
    },
    {
      headerName: 'Tổng tiền thanh toán',
      flex: 1,
      field: 'totalCharge',
      valueFormatter: floatFormatter,
    },
    {
      headerName: 'Phương thức thanh toán',
      flex: 1,
      field: 'paymentMethodId',
      valueGetter: params => {
        const payment = paymentMethod?.items.find(
          item => item.id === params.data?.paymentMethodId,
        );
        return payment?.name ?? params.data?.paymentMethodId;
      },
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
    {
      headerName: '',
      cellRenderer: ButtonCell,
      cellRendererParams: {
        buttons: [
          {
            render: (props: { onClick(): void }) => (
              <button
                className="btn-primary flex items-center"
                onClick={props.onClick}
              >
                Xác nhận thanh toán
              </button>
            ),
            onClick: (data: any) => {
              confirmPaid({ id: data.id });
            },
            hide: (data: any) => {
              return data.status !== 'PENDING';
            },
          },
        ],
      },
    },
  ];

  const handleRequest = () => {
    gridRef.current?.api?.showLoadingOverlay();
    requestData();
  };

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border border-gray-200 rounded-lg flex flex-col shadow-sm"
    >
      <div className="px-5 py-6">
        <div className="text-lg font-semibold">Lịch sử thanh toán</div>
      </div>
      {/* <div>Filter</div> */}
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

export default PaymentHistoryPage;
