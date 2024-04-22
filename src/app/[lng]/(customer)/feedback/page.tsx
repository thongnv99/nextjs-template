'use client';
import Loader from 'components/Loader';
import { ColDef } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import React, { useRef, useState } from 'react';
import { useSWRWrapper } from 'hooks/swr';
import { IContest, ContestRes, IQuestion } from 'interfaces';
import EditIcon from 'assets/svg/edit-2.svg';
import ButtonCell from 'components/DataGrid/ButtonCell';
import { formatNumber, uuid } from 'utils/common';
import { METHOD } from 'global';
import Eye from 'assets/svg/eye.svg';
import Badge from 'components/Badge';
import BadgeCell from 'components/DataGrid/BadgeCell';
import ModalProvider from 'components/ModalProvider';
import QuestionDetailModal from 'components/QuestionDetail';
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
const FeedbackPage = () => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const [modalDetail, setModalDetail] = useState<{
    show?: boolean;
    data?: any;
  }>();
  //lấy danh sách cuộc thi hiện tại
  const { data } = useSWRWrapper<ContestRes>(`/api/v1/admin/feedbacks`, {
    url: '/api/v1/admin/feedbacks',
    method: METHOD.GET,
  });

  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên',
      minWidth: 180,
      field: 'firstName',
      cellClass: 'bold',
      valueFormatter: params => {
        return `${params.data.createdBy.firstName ?? ''} ${
          params.data.createdBy.lastName ?? ''
        }`;
      },
    },
    {
      headerName: 'Email',
      field: 'createdBy.email',
      minWidth: 280,
    },
    {
      headerName: 'Nội dung',
      field: 'content',
      minWidth: 280,
      flex: 1,
    },
    {
      headerName: 'Câu hỏi',
      field: 'question.content',
      minWidth: 280,
      flex: 1,
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
          },
        ],
      },
    },
  ];

  const handleRequest = (e: any) => {
    e?.api?.hideOverlay();
  };

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border bg-white border-gray-200 rounded-lg  m-auto flex flex-col shadow-sm "
    >
      <div className="flex justify-between p-5 ">
        <div className="text-lg font-semibold flex">Feedback</div>
      </div>

      <div className="flex-1">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          headerHeight={44}
          suppressCellFocus
          rowHeight={50}
          onGridReady={handleRequest}
          rowData={data?.items ?? []}
        />
      </div>
      <ModalProvider
        show={modalDetail?.show}
        onClose={() => setModalDetail({ show: false })}
      >
        {modalDetail?.data && (
          <QuestionDetailModal
            feedback={modalDetail.data.content}
            data={modalDetail.data.question as IQuestion}
            onClose={() => setModalDetail({ show: false })}
          />
        )}
      </ModalProvider>
    </Loader>
  );
};
export default FeedbackPage;
