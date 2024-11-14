// src/components/AgGridTable.tsx

import { CellClickedEvent, ColDef, GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, { useMemo, useRef, useState } from 'react';
import { AG_GRID_LOCALE_RU } from '../assets/translations/locale.ru';
import { HtmlRenderer } from '../data/columnDefs';


interface AgGridTableProps {
    gridRef: React.RefObject<AgGridReact<any>>;
    onGridReady: (params: any) => void;
    rowData: any[];
    columnDefs: ColDef[];
    cellClickedListener: (event: CellClickedEvent) => void;
    gridOptions: GridOptions,
    onFilterOpened: () => void
}

const AgGridTable: React.FC<AgGridTableProps> = ({
    gridRef,
    onGridReady,
    rowData,
    columnDefs,
    cellClickedListener,
    gridOptions,
    onFilterOpened
    
}) => {

  const localeText = useMemo(() => {
    return AG_GRID_LOCALE_RU;
  }, [AG_GRID_LOCALE_RU]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        autoHeight: true,
        width: undefined,
        sizeColumnsToFit: true,
        cellDataType: false,
    }), []);

    const [components] = useState({
        htmlRenderer: HtmlRenderer,
    });

    const overlayLoadingTemplate = `<div></div>`;

  return (
    <div
        className="ag-theme-alpine"
        style={{ width: '99%%', height: '85vh' }}
      >
    <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={columnDefs}
          localeText={localeText}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          components={components}
          suppressLastEmptyLineOnPaste={true}
          //@ts-ignore
          gridOptions={gridOptions}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          aggregateOnlyChangedColumns={true}
          detailRowAutoHeight={true}
          overlayLoadingTemplate={overlayLoadingTemplate}
          columnHoverHighlight={true}
          excludeHiddenColumnsFromQuickFilter
          suppressContextMenu={true}
          colResizeDefault={'shift'}
        //   enablePivot={true}
          rowMultiSelectWithClick={true}
          suppressRowClickSelection={true}
          // onRowSelected={onRowSelected}
          onFilterOpened={onFilterOpened}
          suppressScrollOnNewData={true}
        />
        </div>
    );
};

export default AgGridTable;
