'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import Loader from 'components/Loader';
import React, { useRef, useState } from 'react';
import InfoUser from 'components/InfoUser';
import { uuid } from 'utils/common';
import PointCell from 'components/InfoUser/Point';
import { useMutation } from 'hooks/swr';
import { METHOD, ROLES } from 'global';
import { dateTimeFormatter } from 'utils/grid';
import { differenceInMinutes } from 'date-fns';
import { useTranslation } from 'app/i18n/client';
import { CONTEST_HISTORY_STATUS_TRANSLATE } from 'global/translate';
import { useSession } from 'next-auth/react';
import Eye from 'assets/svg/eye.svg';
import ButtonCell from 'components/DataGrid/ButtonCell';
import ModalProvider from 'components/ModalProvider';
import ContestResult from './ContestResult';
const EyeBtn = (props: { onClick(): void }) => {
  return (
    <div
      className="h-[4rem] w-[4rem] bg-yellow-100 flex items-center justify-center rounded-lg cursor-pointer"
      onClick={props.onClick}
    >
      <Eye className="h-5 w-5 text-yellow-500" />
    </div>
  );
};
const ContestHistory = (props: { contestId: string; compact?: boolean }) => {
  const gridRef = useRef<DataGridHandle>();
  const [modalDetail, setModalDetail] = useState<{
    show?: boolean;
    data?: Record<string, unknown>;
  }>({});
  const componentId = useRef(uuid());
  const { t } = useTranslation();
  const { data: session } = useSession();
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

  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'J_24',
      flex: 1,
      field: 'name',
      cellClass: 'bold',
      minWidth: 300,
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
      headerName: 'J_94',
      flex: 1,
      field: 'startTime',
      valueFormatter: dateTimeFormatter,
      minWidth: 200,
    },
    {
      headerName: 'J_95',
      flex: 1,
      field: 'endTime',
      valueFormatter: dateTimeFormatter,
      minWidth: 200,
    },
    {
      headerName: 'J_71',
      flex: 1,
      minWidth: 250,
      field: 'score',
      cellRenderer: PointCell,
      cellRendererParams: (params: any) => {
        return {
          point: params?.data.score,
        };
      },
    },
    {
      headerName: 'J_3',
      children: [
        {
          headerName: 'J_126',
          field: 'statAnswer.totalCorrect',
          cellClass: 'text-right',
          maxWidth: 120,
        },
        {
          headerName: 'J_127',
          field: 'statAnswer.totalIncorrect',
          cellClass: 'text-right',
          maxWidth: 120,
        },
        {
          headerName: 'J_128',
          field: 'statAnswer.totalNotAnswer',
          cellClass: 'text-right',
          maxWidth: 120,
        },
        {
          headerName: 'J_129',
          field: 'statAnswer.total',
          cellClass: 'text-right',
          maxWidth: 120,
        },
      ],
    },
    {
      headerName: 'J_72',
      flex: 1,
      field: 'status',
      valueFormatter: params => {
        return t(
          CONTEST_HISTORY_STATUS_TRANSLATE[params.value] ?? params.value,
        ) as string;
      },
      minWidth: 200,
    },
    {
      headerName: 'J_96',
      flex: 1,
      field: 'forTime',
      minWidth: 200,
      valueFormatter: params => {
        const startTime = params.data.startTime;
        const endTime = params.data.endTime;
        if (startTime && endTime) {
          const minutes = differenceInMinutes(
            new Date(startTime as number),
            new Date(endTime as number),
          );
          return `${Math.abs(minutes)} ${t('J_130')}`;
        }
        return 'J_131';
      },
    },
    {
      headerName: '',
      flex: 0.1,
      cellRenderer: ButtonCell,
      cellRendererParams: {
        buttons: [
          {
            render: EyeBtn,
            onClick: (data: Record<string, unknown>) => {
              setModalDetail({ show: true, data });
            },
            hide: (data: Record<string, unknown>) => {
              return (
                ![ROLES.ADMIN, ROLES.STAFF].includes(session?.user.role) &&
                (data.userId as Record<string, unknown>)?.id !==
                  session?.user.id
              );
            },
          },
        ],
      },
    },
  ];

  const handleRequest = () => {
    gridRef.current?.api?.showLoadingOverlay();
    requestData({
      source: 'CONTEST',
      contestId: props.contestId,
    });
  };

  const refreshData = () => {
    gridRef.current?.api?.setGridOption('rowData', []);
    handleRequest();
  };

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border bg-white border-gray-200 rounded-lg flex flex-col shadow-sm p-1"
    >
      {!props.compact && (
        <div className="px-5 py-3 text-lg font-semibold gap-x-3 flex items-center">
          {t('J_125')}
        </div>
      )}
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
      <ModalProvider
        show={modalDetail.show || false}
        onClose={() => {
          setModalDetail({ show: false });
        }}
      >
        {modalDetail.data && (
          <ContestResult
            onClose={() => {
              setModalDetail({ show: false });
            }}
            onRefresh={refreshData}
            data={modalDetail.data}
          />
        )}
      </ModalProvider>
    </Loader>
  );
};
export default ContestHistory;
