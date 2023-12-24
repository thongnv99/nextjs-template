'use client';
import React, {
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react'; // React Grid Logic
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme
import './style.scss';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

interface DataGridProps extends AgGridReactProps {}
export interface DataGridHandle {
  api?: GridApi;
}
const DataGrid = forwardRef(
  (
    props: DataGridProps,
    ref:
      | ((instance: DataGridHandle) => void)
      | React.MutableRefObject<DataGridHandle | null | undefined>
      | Ref<DataGridHandle | null | undefined>
      | null,
  ) => {
    const { defaultColDef, onGridReady, ...rest } = props;
    const [gridInit, setGridInit] = useState<boolean>(false);

    const dataGridRef = useRef<{
      api?: GridApi;
    }>({});

    useImperativeHandle(
      ref,
      () => ({
        api: dataGridRef.current.api,
      }),
      [gridInit],
    );

    const handleGridReady = (event: GridReadyEvent) => {
      dataGridRef.current.api = event.api;
      setGridInit(true);

      setTimeout(() => {
        onGridReady?.(event);
      });
    };

    return (
      <div className="ag-theme-quartz h-full data-grid">
        <AgGridReact
          onGridReady={handleGridReady}
          defaultColDef={{
            resizable: false,
            minWidth: 60,
            ...defaultColDef,
          }}
          suppressDragLeaveHidesColumns
          suppressRowHoverHighlight
          {...rest}
        />
      </div>
    );
  },
);

DataGrid.displayName = 'DataGrid';

export default DataGrid;
