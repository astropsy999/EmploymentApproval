import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  DialogActions,
  DialogContent
} from '@mui/material';
import { GridApi } from 'ag-grid-community';
import React, { useEffect } from 'react';
import {
  getUsersForManagers,
  multiApproveEmployment,
  multiLockEmloyment,
} from '../../data/api';
import { customLoader } from '../../helpers/customLoader';
import { getDatesInRange } from '../../helpers/datesRanges';
import filterSelectedRowsByDates from '../../helpers/filterSelectedRowsByDates';
import {
  getFioApproveIDsArr,
  getFioLockIDsArr,
} from '../../helpers/getInfoOfSelectedUsers';
import { useRange } from '../../store/dataStore';
import { EmployeeData, FioIdsArray } from '../../types';
import DateCheckboxGroup from '../DateCheckboxGroup';
import ModalHeader from './ModalHeader';
import SelectedEmployeesList from './SelectedEmployeesList';
import { SubmitBeforeLockPopover } from './SubmitBeforeLockPopover';



/**
 * Интерфейс для пропсов компонента SubmitEmploymentLockModal.
 */
interface LockEmploymentModalProps {
  gridApi: GridApi;
  handleCloseSubmitLock: () => void;
  handleAction: (
    actionType: 'approve' | 'lock' | 'unlock',
    dataArray: FioIdsArray[]
  ) => Promise<void>;
  hasUnsubmitted: boolean;
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  updateStateOfNewData: (rowData: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LockEmploymentModal: React.FC<LockEmploymentModalProps> = ({
  gridApi,
  handleCloseSubmitLock,
  handleAction,
  hasUnsubmitted,
  toastSuccess,
  updateStateOfNewData,
  loading,
  setLoading,
}) => {
  console.log("🚀 ~ hasUnsubmitted:", hasUnsubmitted)
  const { startDate, endDate } = useRange();
  const selectedRows: EmployeeData[] = gridApi.getSelectedRows();

  const [checkedDates, setCheckedDates] = React.useState<{
    [key: string]: boolean;
  }>({});

  const lockIDiDDbArray = getFioLockIDsArr(
    filterSelectedRowsByDates(selectedRows, checkedDates),
  );
  const delIDiDDbArray = getFioApproveIDsArr(
    filterSelectedRowsByDates(selectedRows, checkedDates),
  );

  // Получаем массив дат за неделю
  const datesArray = getDatesInRange(new Date(startDate), new Date(endDate));

  

  useEffect(() => {
    // Инициализируем все даты как выбранные
    const initialChecked: { [key: string]: boolean } = {};
    datesArray.forEach((date) => {
      const key = date.toISOString();
      initialChecked[key] = true;
    });
    setCheckedDates(initialChecked);
  }, [startDate, endDate]);

  const handleCheckboxChange = (dateKey: string) => {
    setCheckedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };

  const handleConfirm = async () => {
    await handleAction('lock', lockIDiDDbArray);
    handleCloseSubmitLock();
  };

  const handleConfirmSubmitLock = async () => {
    setLoading(true);
    try {
      const response = await multiApproveEmployment(delIDiDDbArray);

      if (response) {
        toastSuccess('Успешно согласовано');
        try {
          const response = await multiLockEmloyment(lockIDiDDbArray);
          if (response) {
            setLoading(false);
            getUsersForManagers(startDate, endDate).then((rowData) => {
              updateStateOfNewData(rowData);
              customLoader(false);
              toastSuccess('Успешно заблокировано');
            });
          }
        } catch {}
        handleCloseSubmitLock();
      }
    } catch (error) {}
  };

  return (
    <div>
        {lockIDiDDbArray.length > 0
          ? (<ModalHeader title="Массовая блокировка занятости" onClose={handleCloseSubmitLock} color="#ed6d02" />)
          : (<ModalHeader title="Выберите сотрудников" onClose={handleCloseSubmitLock} color="#ed6d02" />)
          }
      <DialogContent dividers sx={{ fontSize: 18, maxWidth: 'sm' }}>
        {lockIDiDDbArray.length > 0 ? (
          <>
            <SelectedEmployeesList title="Вы хотите заблокировать занятость сотрудникам" employees={lockIDiDDbArray} />
            <DateCheckboxGroup
              dates={datesArray}
              checkedDates={checkedDates}
              onChange={handleCheckboxChange}
            />
          </>
        ) : (
          'Необходимо выбрать сотрудников для блокировки'
        )}
      </DialogContent>

      {lockIDiDDbArray.length > 0 && (
        <DialogActions>
          {hasUnsubmitted ? (
            <SubmitBeforeLockPopover
              loading={loading}
              handleConfirm={handleConfirm}
              handleConfirmSubmitLock={handleConfirmSubmitLock}
              handleCloseSubmitLock={handleCloseSubmitLock}
            />
          ) : (
            <LoadingButton
              onClick={handleConfirm}
              loading={loading}
              variant="contained"
              color="success"
              size="large"
            >
              Да
            </LoadingButton>
          )}

          <Button
            autoFocus
            onClick={handleCloseSubmitLock}
            variant="contained"
            color="error"
            size="large"
          >
            Нет
          </Button>
        </DialogActions>
      )}
    </div>
  );
};
