'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import BadgeCell from 'components/DataGrid/BadgeCell';
import ButtonCell from 'components/DataGrid/ButtonCell';
import Loader from 'components/Loader';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import React, { useRef, useState } from 'react';
import { PAYMENT_QUERY_HISTORY } from 'store/key';
import { uuid } from 'utils/common';
import { floatFormatter } from 'utils/grid';
import Plus from 'assets/svg/plus.svg';
import Upload from 'assets/svg/upload-cloud.svg';
import Trash from 'assets/svg/trash-2.svg';
import Edit from 'assets/svg/edit-2.svg';
import ModalProvider from 'components/ModalProvider';
import ConfirmModal from 'components/ConfirmModal';
import { IBlog } from 'interfaces';
import { useParams, useRouter } from 'next/navigation';
import { useUpdateBlogMutation } from './mutation';
import { useTranslation } from 'app/i18n/client';

const DeleteBtn = (props: { onClick(): void }) => {
  return (
    <div
      className="h-[4rem] w-[4rem] bg-[#FF002E14] flex items-center justify-center rounded-lg cursor-pointer"
      onClick={props.onClick}
    >
      <Trash className="h-5 w-5 text-[#D80027]" />
    </div>
  );
};

const EditBtn = (props: { onClick(): void }) => {
  return (
    <div
      className="h-[4rem] w-[4rem] bg-[#514EFF1A] flex items-center justify-center rounded-lg cursor-pointer"
      onClick={props.onClick}
    >
      <Edit className="h-5 w-5 text-[#7B61FF]" />
    </div>
  );
};

const UploadBtn = (props: { onClick(): void }) => {
  return (
    <div
      className="h-[4rem] w-[4rem] flex bg-[#1ABD001A] items-center justify-center rounded-lg cursor-pointer"
      onClick={props.onClick}
    >
      <Upload className="h-5 w-5 text-[#1ABD00]" />
    </div>
  );
};

const BlogManagement = () => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const { lng } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { trigger: requestData } = useMutation<{
    items: Record<string, unknown>[];
  }>('BLOG_QUERY_BY_ME', {
    url: '/api/v1/postsByMe',
    method: METHOD.GET,
    onSuccess(data) {
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.applyTransaction({
        add: data.items,
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
    },
  });

  const { trigger: deleteBlog } = useMutation<{
    items: Record<string, unknown>[];
  }>('BLOG_DELETE_BLOG', {
    url: '/api/v1/posts/{postId}',
    method: METHOD.DELETE,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'J_88',
      content: 'J_89',
    },
    onSuccess: data => {
      setConfirmDeleteModal({ show: false });
      refreshData();
    },
  });

  const { trigger: updateBlog } = useUpdateBlogMutation({
    onSuccess: () => {
      setConfirmPublishModal({ show: false });
      refreshData();
    },
    componentId: componentId.current,
  });

  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    show?: boolean;
    data?: IBlog;
  }>({ show: false });
  const [confirmPublishModal, setConfirmPublishModal] = useState<{
    show?: boolean;
    data?: IBlog;
  }>({ show: false });

  function refreshData() {
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    requestData();
  }

  const handleRequest = () => {
    gridRef.current?.api?.showLoadingOverlay();
    requestData();
  };

  const handleShowConfirmDelete = (data: IBlog) => {
    setConfirmDeleteModal({ show: true, data });
  };

  const handleConfirmDelete = () => {
    deleteBlog({ postId: confirmDeleteModal.data?.id });
  };

  const handleCloseDelete = () => {
    setConfirmDeleteModal({ show: false });
  };

  const handleShowConfirmPublish = (data: IBlog) => {
    setConfirmPublishModal({ show: true, data });
  };

  const handleConfirmPublish = () => {
    updateBlog({ postId: confirmPublishModal.data?.id, status: 'PUBLISH' });
  };

  const handleClosePublish = () => {
    setConfirmPublishModal({ show: false });
  };

  const handleCreateClick = () => {
    router.push(`/${lng}/blog/blog-form`);
  };

  const columnDefs: Array<ColDef> = [
    {
      headerName: 'J_81',
      flex: 1,
      field: 'title',
      cellClass: 'bold',
    },
    {
      headerName: 'J_72',
      flex: 1,
      field: 'status',
      cellRenderer: BadgeCell,
      cellRendererParams: {
        dot: true,
        colorClass: {
          DRAFT: 'bg-yellow-100 text-yellow-500',
          PUBLISH: 'bg-green-100 text-green-500',
        },
      },
    },
    {
      headerName: '',
      cellRenderer: ButtonCell,
      cellRendererParams: {
        buttons: [
          {
            render: DeleteBtn,
            onClick: handleShowConfirmDelete,
          },
          {
            render: EditBtn,
            onClick: (data: IBlog) => {
              router.push(`/${lng}/blog/blog-form?id=${data.id}`);
            },
          },
          {
            render: UploadBtn,
            onClick: handleShowConfirmPublish,
            hide: (data: IBlog) => {
              return data.status !== 'DRAFT';
            },
          },
        ],
      },
    },
  ];

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full bg-white border border-gray-200 rounded-lg flex flex-col shadow-sm"
    >
      <div className="px-5 py-6 flex justify-between">
        <div className="text-lg font-semibold">{t('J_87')}</div>
        <button
          type="button"
          className="btn-primary btn-icon"
          onClick={handleCreateClick}
        >
          <Plus /> {t('J_90')}
        </button>
      </div>
      <div className="flex-1">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          headerHeight={44}
          suppressCellFocus
          rowHeight={72}
          onGridReady={handleRequest}
          getRowId={params => {
            return params.data?.id;
          }}
        />
      </div>
      <ModalProvider
        show={confirmDeleteModal?.show}
        onClose={handleCloseDelete}
      >
        <ConfirmModal
          type="error"
          title="J_88"
          content="J_91"
          onCancel={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      </ModalProvider>
      <ModalProvider
        show={confirmPublishModal?.show}
        onClose={handleClosePublish}
      >
        <ConfirmModal
          type="error"
          title="J_92"
          content="J_93"
          onCancel={handleClosePublish}
          onConfirm={handleConfirmPublish}
        />
      </ModalProvider>
    </Loader>
  );
};

export default BlogManagement;
