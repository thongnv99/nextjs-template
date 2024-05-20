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
import { METHOD, ROLES } from 'global';
import { useMutation } from 'hooks/swr';
import Badge from 'components/Badge';
import BadgeCell from 'components/DataGrid/BadgeCell';
import { Formik } from 'formik';
import { useTranslation } from 'app/i18n/client';
import Dropdown from 'elements/Dropdown';
import { ROLES_TRANSLATE } from 'global/translate';
import RadioGroup from 'elements/RadioGroup';
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
  const { t } = useTranslation();
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const [createModal, setCreateModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    show?: boolean;
    data?: any;
  }>({ show: false });
  const [editModal, setEditModal] = useState<{
    show?: boolean;
    data?: any;
  }>({ show: false });

  const handleShowConfirmDelete = (data: IContest) => {
    setConfirmDeleteModal({ show: true, data });
  };
  const handleCloseDelete = () => {
    setConfirmDeleteModal({ show: false });
  };
  const handleShowEditModal = (data: IContest) => {
    setEditModal({ show: true, data });
  };
  const handleCloseEditModal = () => {
    setEditModal({ show: false });
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

  const { trigger: updateUser, isMutating } = useMutation<{
    items: Record<string, unknown>[];
  }>('USER_UPDATE_USER', {
    url: '/api/v1/admin/users/{userId}',
    method: METHOD.PUT,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'Cập nhật tài khoản',
      content: 'Cập nhật tài khoản thành công',
    },
    onSuccess: data => {
      setConfirmDeleteModal({ show: false });
      handleCloseEditModal();
      refreshData();
    },
  });

  function refreshData() {
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    mutate();
  }

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
      headerName: 'Loại tài khoản',
      field: 'role',
      valueFormatter: params => {
        return t(ROLES_TRANSLATE[params.value]);
      },
    },
    {
      headerName: 'Số cuộc thi tham gia',
      field: 'contest.totalSessionCompleted',
      cellClass: 'text-right',
    },
    {
      headerName: 'Số đề thi đã làm',
      field: 'exam.totalSessionCompleted',
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
      maxWidth: 200,
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
            hide: (data: Record<string, unknown>) => {
              return data.role === ROLES.ADMIN;
            },
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

  const handleConfirmDelete = () => {
    updateUser({
      userId: confirmDeleteModal.data.id,
      statusInfo:
        (confirmDeleteModal.data?.statusInfo as any)?.status === 'LOCKED'
          ? 'ACTIVE'
          : 'LOCKED',
    });
  };
  const handleSubmitEdit = (values: { role: string }) => {
    updateUser({
      userId: editModal.data.id,
      role: values.role,
    });
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

      <ModalProvider
        show={confirmDeleteModal?.show}
        onClose={handleCloseDelete}
      >
        <ConfirmModal
          type={
            (confirmDeleteModal.data?.statusInfo as any)?.status === 'LOCKED'
              ? 'success'
              : 'error'
          }
          title={
            (confirmDeleteModal.data?.statusInfo as any)?.status === 'LOCKED'
              ? 'Mở khóa tài khoản'
              : 'Khóa tài khoản'
          }
          content={
            (confirmDeleteModal.data?.statusInfo as any)?.status === 'LOCKED'
              ? 'Bạn có chắc chắn muốn mở khóa tài khoản này không?'
              : 'Bạn có chắc chắn muốn khóa tài khoản này không?'
          }
          onCancel={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      </ModalProvider>
      <ModalProvider show={editModal.show} onClose={handleCloseEditModal}>
        {editModal.data && (
          <div className="w-screen max-w-screen-sm p-6">
            <div className="flex flex-col mb-5">
              <div className="text-lg font-bold text-gray-900">
                {t('Cập nhật loại tài khoản')}
              </div>
            </div>
            <Formik
              initialValues={{
                role: editModal.data.role,
              }}
              onSubmit={handleSubmitEdit}
            >
              {({ values, handleSubmit, setFieldValue }) => (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <RadioGroup
                    value={values.role}
                    className="flex flex-col gap-2"
                    options={[
                      {
                        label: ROLES_TRANSLATE[ROLES.STAFF],
                        value: ROLES.STAFF,
                      },
                      {
                        label: ROLES_TRANSLATE[ROLES.USER_FREE],
                        value: ROLES.USER_FREE,
                      },
                      {
                        label: ROLES_TRANSLATE[ROLES.USER_PREMIUM],
                        value: ROLES.USER_PREMIUM,
                      },
                    ]}
                    onChange={value => setFieldValue('role', value)}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn flex-1"
                      onClick={handleCloseEditModal}
                    >
                      {t('J_61')}
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      {t('C_1')}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        )}
      </ModalProvider>
    </Loader>
  );
};
export default UserMgmtPage;
