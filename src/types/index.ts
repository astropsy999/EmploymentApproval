import { GridApi, ColumnApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

/**
 * Интерфейс для данных сотрудника.
 */
export interface EmployeeData {
  "ФИО": string;
  [date: string]: string;
}

/**
 * Интерфейс для массива данных с ФИО и соответствующими ID.
 */
export interface FioIdsArray {
  [fio: string]: string[];
}

/**
 * Интерфейс для пропсов компонента ModalHeader.
 */
export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  color: string;
}

/**
 * Интерфейс для данных сотрудника.
 */
export interface DateIdMap {
  [date: string]: number;
}

/**
 * Интерфейс для пропсов компонента CalendarComponent.
 */
export interface CalendarComponentProps {
  events: any[]; // Определите более конкретный тип, если возможно
  selectedDate: Date | null;
  slotMinTime: string;
  slotMaxTime: string;
  eventContent: (info: any) => { domNodes: HTMLElement[] };
}

/**
 * Интерфейс для пропсов компонента DataGridComponent.
 */
export interface DataGridComponentProps {
  gridApiRef: React.RefObject<AgGridReact<EmployeeData>>;
  rowData: EmployeeData[];
  columnDefs: any[]; // Определите более конкретный тип колонок, если возможно
  onGridReady: (params: { api: GridApi; columnApi: ColumnApi }) => void;
  onCellClicked: (event: any) => void;
  onRowSelected: () => void;
  onFilterOpened: () => void;
  // Добавьте другие необходимые пропсы
}

/**
 * Интерфейс для пропсов компонента Toolbar.
 */
export interface ToolbarProps {
  handleOpenModalSubmit: () => void;
  handleOpenModalSubmitLocking: () => void;
  handleOpenModalSubmitUnlocking: () => void;
  reloadPage: () => void;
}

/**
 * Интерфейс для пропсов модальных окон.
 */
export interface SubmitEmploymentModalProps {
  gridApi: GridApi;
  handleAction: (
    actionType: string,
    dataArray: FioIdsArray[],
    selectedDates: Date[]
  ) => Promise<void>;
  handleCloseSubmit: () => void;
  loading: boolean;
}

export interface SubmitEmploymentLockModalProps {
  gridApi: GridApi;
  handleCloseSubmitLock: () => void;
  handleAction: (
    actionType: 'approve' | 'lock' | 'unlock',
    dataArray: FioIdsArray[]
  ) => Promise<void>;
  hasUnsubmitted: boolean;
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  updateStateOfNewData: (rowData: any) => void; // Замените `any` на конкретный тип данных, если возможно
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface SubmitEmploymentUnlockModalProps {
  gridApi: GridApi;
  handleAction: (
    actionType: 'approve' | 'lock' | 'unlock',
    dataArray: FioIdsArray[]
  ) => Promise<void>;
  handleCloseSubmitUnlock: () => void;
  loading: boolean;
}
