'use client';
import { ColDef } from 'ag-grid-community';
import { useTranslation } from 'app/i18n/client';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import BadgeCell from 'components/DataGrid/BadgeCell';
import ButtonCell from 'components/DataGrid/ButtonCell';
import ExamChart from 'components/ExamChart';
import InfoUserPoint from 'components/InfoUser/Point';
import Loader from 'components/Loader';
import { METHOD } from 'global';
import { useMutation, useSWRWrapper } from 'hooks/swr';
import { IExam } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { uuid } from 'utils/common';
import { dateTimeFormatter } from 'utils/grid';

const ExamHistory = (props: { examId: string }) => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const router = useRouter();
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const { data: examData } = useSWRWrapper<IExam>(
    `/api/v1/exams/${props.examId}`,
    {
      url: `/api/v1/exams/${props.examId}`,
    },
  );
  const { trigger: requestData, data } = useMutation<{
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

  const columnDefs: Array<ColDef> = [
    {
      headerName: 'J_70',
      width: 150,
      field: 'startTime',
      valueFormatter: dateTimeFormatter,
    },
    {
      headerName: 'J_24',
      width: 120,
      field: 'userId',
      valueFormatter: params =>
        `${params.data.userId.firstName ?? ''} ${
          params.data.userId.lastName ?? ''
        }`,
    },
    {
      headerName: 'J_71',
      flex: 1,
      field: 'statScore',
      minWidth: 120,
      cellRenderer: InfoUserPoint,
      cellRendererParams: (params: any) => {
        return {
          point:
            (Number(params?.data?.statScore?.totalCorrect ?? 0) * 100) /
            Number(params?.data?.statScore?.total ?? 1),
          total: Number(params?.data?.statScore?.total ?? 1),
          correct: Number(params?.data?.statScore?.totalCorrect ?? 0),
        };
      },
    },
    {
      headerName: 'J_72',
      field: 'status',
      cellRenderer: BadgeCell,
      cellRendererParams: {
        dot: true,
        colorClass: {
          PENDING: 'bg-yellow-100 text-yellow-500',
          SESSION_PAUSE: 'bg-yellow-100 text-yellow-500',
          CONFIRMING: 'bg-primary-100 text-primary-500',
          SUCCESS: 'bg-green-100 text-green-500',
          FAILED: 'bg-red-100 text-red-500',
        },
      },
    },
    {
      headerName: '',
      field: 'status',
      cellRenderer: ButtonCell,
      cellRendererParams: {
        buttons: [
          {
            render: (props: { onClick(): void }) => {
              return (
                <button
                  className="btn h-full flex items-center hover:!bg-primary hover:text-white"
                  type="button"
                  onClick={props.onClick}
                >
                  {t('J_73')}
                </button>
              );
            },
            onClick: (data: { id: string; examId: string }) => {
              router.push(
                `/${lng}/exam/do-exam/${data.examId}?session=${data.id}`,
              );
            },
            hide: (data: { status: string }) => {
              return data.status !== 'SESSION_PAUSE';
            },
          },
        ],
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
        <div className="text-lg font-semibold">
          {t('J_74')} {examData?.title}{' '}
        </div>
      </div>
      <div className="h-[20rem]">
        <ExamChart data={data?.items ?? []} />
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
