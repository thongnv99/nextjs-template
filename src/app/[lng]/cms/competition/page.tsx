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
import TrashIcon from 'assets/svg/trash-2.svg';
import EditIcon from 'assets/svg/edit-2.svg';
import ButtonCell from 'components/DataGrid/ButtonCell';
import ConfirmModal from 'components/ConfirmModal';
import { uuid } from 'utils/common';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
const Coppy = (props: { onClick(): void }) => {
  return (
    <div>
      <CoppyIcon className="hover:cursor-pointer" />
    </div>
  );
};
const Trash = (props: { onClick(): void }) => {
  return (
    <div onClick={props.onClick}>
      <TrashIcon className="hover:cursor-pointer" />
    </div>
  );
};

const Edit = (props: { onClick(): void }) => {
  return (
    <div onClick={props.onClick}>
      <EditIcon className="hover:cursor-pointer" />
    </div>
  );
};

const Competition = () => {
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

  const handleConfirmDelete = () => {
    deleteCompetition({ contestId: confirmDeleteModal.data?.id });
  };
  const handleCloseDelete = () => {
    setConfirmDeleteModal({ show: false });
  };
  //lấy danh sách cuộc thi hiện tại
  const { data, isLoading, mutate } = useSWRWrapper<ContestRes>(
    `api/v1/contests`,
    {
      url: '/api/v1/contests',
      method: METHOD.GET,
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );
  //Xóa cuộc thi
  const { trigger: deleteCompetition } = useMutation<{
    items: Record<string, unknown>[];
  }>('COMPETITION_DELETE_COMPETITION', {
    url: '/api/v1/contests/{contestId}',
    method: METHOD.DELETE,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'Xóa cuộc thi',
      content: 'Xóa cuộc thi thành công',
    },
    onSuccess: data => {
      setConfirmDeleteModal({ show: false });
      mutate();
    },
  });

  //Thêm cuộc thi

  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên cuộc thi',
      flex: 1,
      field: 'title',
      cellClass: 'bold',
    },
    {
      headerName: 'Mô tả',
      flex: 2,
      field: 'description',
    },
    {
      headerName: 'Ngày bắt đầu',
      flex: 1,
      field: 'startTime',
    },
    {
      headerName: 'Ngày kết thúc',
      flex: 1,
      field: 'endTime',
    },
    {
      headerName: 'Trạng thái',
      flex: 1,
      field: 'status',
      cellRenderer: StatusCell,
      cellRendererParams: {
        colorClass: {
          DRAFT: 'bg-[var(--warning-50)] text-[var(--warning-700)]',
          PUBLISH: 'bg-[var(--success-50)] text-[var(--success-700)]',
        },
      },
    },
    {
      headerName: '',
      flex: 1,
      cellRenderer: ButtonCell,
      cellRendererParams: {
        buttons: [
          {
            render: Trash,
            onClick: handleShowConfirmDelete,
          },
          {
            render: Edit,
            onClick: handleShowEditModal,
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
      className="h-full w-full border border-gray-200 rounded-lg  m-auto flex flex-col shadow-sm p-5 "
    >
      <div className="flex justify-between">
        <div className="text-lg font-semibold">Quản lý cuộc thi</div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="btn-primary btn-icon"
            onClick={handleCreateClick}
          >
            <Plus /> Thêm cuộc thi
          </button>
        </div>
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
          rowData={data?.items ?? []}
          suppressCellFocus
          rowHeight={50}
          onGridReady={handleRequest}
        />
      </div>
      <ModalProvider show={createModal}>
        <AddExamForm
          onClose={() => setCreateModal(false)}
          onRefresh={() => {
            mutate();
          }}
        />
      </ModalProvider>

      <ModalProvider show={confirmDeleteModal?.show}>
        <ConfirmModal
          type="error"
          title="Xóa cuộc thi"
          content="Bạn có chắc chắn muốn xóa cuộc thi này không?"
          onCancel={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      </ModalProvider>

      <ModalProvider show={editModal?.show}>
        <AddExamForm
          data={editModal?.data}
          onClose={() => setEditModal({ show: false })}
          onRefresh={() => {
            mutate();
          }}
        />
      </ModalProvider>
    </Loader>
  );
};
export default Competition;
