'use client';
import { ColDef, ColGroupDef, IDatasource } from 'ag-grid-community';
import DataGrid, { DataGridHandle } from 'components/DataGrid';
import Loader from 'components/Loader';
import React, { useRef } from 'react';
import InfoUser from 'components/InfoUser';
import { uuid } from 'utils/common';
import InfoUserPoint from 'components/InfoUser/InfoUserPoint';
import PieChart from 'components/PieChart'
import TextInput from 'elements/TextInput';
import Search from 'assets/svg/search.svg';
import Filter from 'assets/svg/Filters lines.svg'
import ActionIcon from 'components/InfoUser/ActionIcon'
const CompetitionHistory = () => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());

  const data1: [string, number][] = [
    ['Trung bình', 60],
    ['Khá', 30],
    ['Giỏi', 10],
   
  ];
  const data2: [string, number][] = [
    ['Đúng ', 60],
    ['Sai', 30],
    ['Không trả lời', 10],
   
  ];

  const rowData = [
    // Example data, replace with your actual data
    { name: "Phạm Văn Thành",email:'phamvanthanh@gmail.com', point: 50, forTime: '60 p', sinceTime: '21:10:30 21/11/2023' },
    { name: 'Nguyễn văn Thông',email:'nguyenvanthong@gmail.com', point: 70, forTime: '60 p', sinceTime: '21:10:30 21/11/2023' },
    { name: 'Nguyễn Duy Trinh',email:'trinhcos2xx@gmail.com', point: 100, forTime: '60 p', sinceTime: '21:10:30 21/11/2023' },
    { name: 'Phí Minh Phương',email:'pmp@gmail.com', point: 100, forTime: '60 p', sinceTime: '21:10:30 21/11/2023' },
    // ... add more rows as needed
  ];

  // function refreshData() {
  //   gridRef.current?.api?.updateGridOptions({ rowData: [] });
  // }
  const columnDefs: Array<ColDef> = [
    {
      headerName: 'Tên ',
      flex: 1,
      field: 'name',
      cellClass: 'bold',
      cellRenderer: InfoUser,
      cellRendererParams:(params:any)=>{
        return {
        name:params?.data.name,
        email:params?.data.email
        }
      }
    },
    {
      headerName: 'Điểm số',
      flex: 1,
      field: 'point',
      cellRenderer:InfoUserPoint,
      cellRendererParams: (params:any)=>{
        return {
          point:params?.data.point
        }
      }
    },
    {
      headerName: 'Thời gian làm bài',
      flex: 1,
      field: 'forTime',
    },
    {
      headerName: 'Thời gian thi',
      flex: 1,
      field: 'sinceTime',
    },
    {
      headerName: '',
      flex:0.1,
      cellRenderer:ActionIcon,
      cellRendererParams:{}
    },
  ];

  const handleRequest = (e: any) => {
    e?.api?.hideOverlay();
  };

  return (
    <Loader
      id={componentId.current}
      className="h-full w-full border border-gray-200 rounded-lg flex flex-col shadow-sm p-1"
    >
      <div className="px-5 py-3 text-lg font-semibold gap-x-3 flex items-center">
        Lịch sử cuộc thi <span className="text-[1.2rem] text-[var(--brand-800)] bg-[var(--gray-50)] rounded-full px-[1rem]">240 người tham gia</span>
      </div>
      <div className="flex h-1/4 justify-evenly">

        <PieChart data={data1}/>
        <PieChart data={data2}/>
      </div>
      <div className="w-full my-4 flex justify-between">
        <button className="btn ">Group button</button>
        <div className="flex gap-x-1">
          <TextInput leadingIcon={<Search />} placeholder="Search" lineheight="!py-2" />
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
    </Loader>
  );
};
export default CompetitionHistory;
