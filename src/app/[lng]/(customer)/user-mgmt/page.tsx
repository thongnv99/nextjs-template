'use client';
import Loader from 'components/Loader';
import Plus from 'assets/svg/plus.svg';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import Filter from 'assets/svg/Filters lines.svg';
import { ColDef } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import React, { useRef, useState } from 'react';
import StatusCell from 'components/CompetitionManagement/StatusCell';
import GroupButton from 'components/GroupButton';
import ModalProvider from 'components/ModalProvider';
import AddExamForm from 'components/CompetitionManagement/AddExamForm';
import { useSWRWrapper } from 'hooks/swr';
import { IContest, ContestRes } from 'interfaces';
import CoppyIcon from 'assets/svg/copy.svg';
import TrashIcon from 'assets/svg/lock.svg';
import EditIcon from 'assets/svg/edit-2.svg';
import ButtonCell from 'components/DataGrid/ButtonCell';
import ConfirmModal from 'components/ConfirmModal';
import { formatNumber, uuid } from 'utils/common';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import Badge from 'components/Badge';
import BadgeCell from 'components/DataGrid/BadgeCell';
const Coppy = (props: { onClick(): void }) => {
  return (
    <div>
      <CoppyIcon className="hover:cursor-pointer" />
    </div>
  );
};
const Trash = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      className="bg-red-200 hover:opacity-80 text-red-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <TrashIcon className="hover:cursor-pointer" />
    </div>
  );
};

const Edit = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      className="bg-primary-200 hover:opacity-80 text-primary-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <EditIcon className="hover:cursor-pointer" />
    </div>
  );
};

const UserMgmtPage = () => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const [createModal, setCreateModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    show?: boolean;
    data?: IContest;
  }>({ show: false });
  const [editModal, setEditModal] = useState<{
    show?: boolean;
    data?: IContest;
  }>({ show: false });

  const handleShowConfirmDelete = (data: IContest) => {
    setConfirmDeleteModal({ show: true, data });
  };
  const handleShowEditModal = (data: IContest) => {
    setEditModal({ show: true, data });
  };

  //lấy danh sách cuộc thi hiện tại
  const { data, isLoading, mutate } = useSWRWrapper<ContestRes>(
    `/api/v1/admin/users`,
    {
      url: '/api/v1/admin/users',
      method: METHOD.GET,
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );
  console.log({ data });

  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên',
      minWidth: 180,

      field: 'firstName',
      cellClass: 'bold',
      valueFormatter: params => {
        return `${params.data.firstName ?? ''} ${params.data.lastName ?? ''}`;
      },
    },
    {
      headerName: 'Email',
      field: 'email',
      minWidth: 280,
    },
    {
      headerName: 'Ngày sinh',
      field: 'dob',
      minWidth: 80,
    },
    {
      headerName: 'Số điện thoại',
      field: 'phoneNumber',
      minWidth: 80,
    },
    {
      headerName: 'Giới tính',
      field: 'gender',
      valueFormatter: params => {
        return params.value === 'MALE' ? 'Nam' : 'Nữ';
      },
    },
    {
      headerName: 'Số cuột thi tham gia',
      field: 'contest.totalCompleted',
      cellClass: 'text-right',
    },
    {
      headerName: 'Số đề thi đã làm',
      field: 'exam.totalCompleted',
      cellClass: 'text-right',
    },
    {
      headerName: 'Số giờ đã học',
      field: 'exam.totalTimeCompleted',
      cellClass: 'text-right',
      valueFormatter: params => {
        return formatNumber(Number(params.value || 0) / 60 / 60, 2);
      },
    },
    {
      headerName: 'Số flashcard đã học',
      field: 'flashcard.totalLearned',
      cellClass: 'text-right',
    },
    {
      headerName: 'Trạng thái',
      field: 'statusInfo.status',
      cellRenderer: BadgeCell,
      minWidth: 120,
      cellRendererParams: {
        dot: true,
        colorClass: {
          INACTIVE: 'bg-yellow-100 text-yellow-500',
          ACTIVE: 'bg-green-100 text-green-500',
          LOCKED: 'bg-red-100 text-red-500',
        },
      },
    },
    {
      headerName: '',
      pinned: 'right',
      maxWidth: 60,
      cellRenderer: ButtonCell,
      cellRendererParams: {
        buttons: [
          {
            render: Trash,
            onClick: handleShowConfirmDelete,
          },
        ],
      },
    },
  ];

  const handleRequest = (e: any) => {
    e?.api?.hideOverlay();
  };

  const handleCreateClick = () => {
    setCreateModal(true);
  };
  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border bg-white border-gray-200 rounded-lg  m-auto flex flex-col shadow-sm "
    >
      <div className="flex justify-between p-5 ">
        <div className="text-lg font-semibold flex">
          Quản lý người dùng{' '}
          <Badge
            content={`${data?.items.length ?? 0} Người dùng`}
            className="bg-green-100 text-green-500 ml-4 -translate-y-[0.8rem] text-[1rem]"
          />
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
          rowData={data?.items ?? []}
        />
      </div>
    </Loader>
  );
};
export default UserMgmtPage;
