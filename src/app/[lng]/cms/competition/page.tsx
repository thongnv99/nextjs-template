"use client"
import Loader from 'components/Loader';
import Plus from 'assets/svg/plus.svg';
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import Filter from 'assets/svg/Filters lines.svg'
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import React, { useRef,useState } from 'react';
import {EXAM_STATUS} from 'global'
import StatusCell from 'components/CompetitionManagement/StatusCell'
import ActionGroupIcon from 'components/CompetitionManagement/ActionGroupIcon'
import GroupButton from 'components/GroupButton'
import FlashCardForm from 'components/FlashCard/FlashCardForm';
import ModalProvider from 'components/ModalProvider';
import AddExamForm from 'components/CompetitionManagement/AddExamForm'


const Competition=()=>{
    const gridRef = useRef<DataGridHandle>();
    const [createModal, setCreateModal] = useState(false);
    const rowData = [
        // Example data, replace with your actual data
        { name: "Thi thử 2023",exam:'Đề thi 2023', dateStart: '23/1/2023', dateFinish: '25/1/2023', count: '21',password:'*****', status:'UPCOMING' },
        { name: "Thi thử 2023",exam:'Đề thi 2023', dateStart: '23/1/2023', dateFinish: '25/1/2023', count: '21',password:'*****', status:'HAPPENNING' },
        { name: "Thi thử 2023",exam:'Đề thi 2023', dateStart: '23/1/2023', dateFinish: '25/1/2023', count: '21',password:'*****', status:'COMPLETE' },
        { name: "Thi thử 2023",exam:'Đề thi 2023', dateStart: '23/1/2023', dateFinish: '25/1/2023', count: '21',password:'*****', status:'CANCEL' },
        { name: "Thi thử 2023",exam:'Đề thi 2023', dateStart: '23/1/2023', dateFinish: '25/1/2023', count: '21',password:'*****', status:'COMPLETE' },
        { name: "Thi thử 2023",exam:'Đề thi 2023', dateStart: '23/1/2023', dateFinish: '25/1/2023', count: '21',password:'*****', status:'COMPLETE' },
        // ... add more rows as needed
      ];
    const columnDefs: Array<ColDef> = [
        {
          headerName: 'Tên cuộc thi',
          flex: 1,
          field: 'name',
          cellClass: 'bold',
        },
        {
          headerName:'Đề thi',
          flex: 1,
          field: 'exam',
        },
        {
          headerName: 'Ngày bắt đầu',
          flex: 1,
          field: 'dateStart',
        },
        {
          headerName: 'Ngày kết thúc',
          flex: 1,
          field: 'dateFinish',
        },
        {
            headerName: 'SL tham gia',
            flex: 1,
            field: 'count',
        },
        {
            headerName: 'Mật khẩu',
            flex: 1,
            field: 'password',
        },
        {
            headerName: 'Trạng thái',
            flex: 1,
            field: 'status',
            cellRenderer:StatusCell,
            cellRendererParams:{
                colorClass:{
                    UPCOMING:'bg-[var(--warning-50)] text-[var(--warning-700)]',
                    HAPPENNING:'bg-[var(--success-50)] text-[var(--success-700)]',
                    CANCEL:'bg-[var(--error-50)] text-[var(--error-500)]',
                    COMPLETE:'bg-[var(--purple-50)] text-[var(--purple-700)]'
                },
            },
        },
        {
          headerName: '',
          flex:1,
          cellRenderer:ActionGroupIcon,
          cellRendererParams:{
          }
        },
      ];
    
      const handleRequest = (e: any) => {
        e?.api?.hideOverlay();
      };

      const handleCreateClick = () => {
        setCreateModal(true);
      };    
    return (
        <Loader className="h-full w-full border border-gray-200 rounded-lg  m-auto flex flex-col shadow-sm p-5 ">
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
                <GroupButton/>
                <div className="flex gap-x-1">
                <TextInput leadingIcon={<Search />} placeholder="Search" inputClass="!py-2" />
                    <button className="btn flex items-center gap-x-2" type="button"><Filter/>Filter</button>
                </div>
            </div>
            <div className="flex-1">
                <DataGrid
                ref={gridRef}
                columnDefs={columnDefs}
                headerHeight={44}
                rowData={rowData}
                suppressCellFocus
                rowHeight={50}
                onGridReady={handleRequest}
                />
            </div>
            <ModalProvider show={createModal}>
              <AddExamForm
                onClose={() => setCreateModal(false)}
              />
            </ModalProvider>

        </Loader>
    )
}
export default Competition