import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  DialogActions,
  DialogContent
} from '@mui/material';
import { GridApi } from 'ag-grid-community';
import React, { useEffect } from 'react';
import { getDatesInRange } from '../../helpers/datesRanges';
import { getFioUnlockIDsArr } from '../../helpers/getInfoOfSelectedUsers';
import { useRange } from '../../store/dataStore';
import DateCheckboxGroup from '../DateCheckboxGroup';
import ModalHeader from './ModalHeader';
import SelectedEmployeesList from './SelectedEmployeesList';
import filterSelectedRowsByDates from '../../helpers/filterSelectedRowsByDates';

interface UnlockEmploymentModalProps {
  gridApi: GridApi;
  handleAction: (action: string, data: any) => Promise<void>;
  handleCloseSubmitUnlock: () => void;
  loading: boolean;
}

export const UnlockEmploymentModal: React.FC<UnlockEmploymentModalProps> = ({
  gridApi,
  handleAction,
  handleCloseSubmitUnlock,
  loading,
}) => {
  const { startDate, endDate } = useRange();
  const [checkedDates, setCheckedDates] = React.useState<{
    [key: string]: boolean;
  }>({});

  const selectedRows = gridApi.getSelectedRows();

  const unlockIDiDDbArray = getFioUnlockIDsArr(filterSelectedRowsByDates(selectedRows, checkedDates));
  console.log("🚀 ~ unlockIDiDDbArray:", unlockIDiDDbArray)

  // Получаем массив дат за неделю
  const datesArray = getDatesInRange(new Date(startDate), new Date(endDate));

  const handleCheckboxChange = (dateKey: string) => {
    setCheckedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };

  useEffect(() => {
    // Инициализируем все даты как выбранные
    const initialChecked: { [key: string]: boolean } = {};
    datesArray.forEach((date) => {
      const key = date.toISOString();
      initialChecked[key] = true;
    });
    setCheckedDates(initialChecked);
  }, [startDate, endDate]);

  const handleConfirm = async () => {
    await handleAction('unlock', unlockIDiDDbArray);
    handleCloseSubmitUnlock();
  };

  const submitStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: 'background.paper',
    border: '1px solid lightgray',
    borderRadius: '10px',
    boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.1)',
    padding: 4,
    height: '200px',
  };

  return (
    //@ts-ignore
    <div sx={submitStyle}>
 
        {unlockIDiDDbArray.length > 0
          ? <ModalHeader title="Массовая разблокировка занятости" onClose={handleCloseSubmitUnlock} color="#2d79e6" />
          : <ModalHeader title="Выберите сотрудников!" onClose={handleCloseSubmitUnlock} color="red" />
          }
      
      <DialogContent dividers sx={{ fontSize: 18, maxWidth: 'sm' }}>
        {unlockIDiDDbArray.length > 0 ? (
          <>
            <SelectedEmployeesList
              title="Вы хотите разблокировать занятость сотрудникам"
              employees={unlockIDiDDbArray}
            />
            <DateCheckboxGroup
              dates={datesArray}
              checkedDates={checkedDates}
              onChange={handleCheckboxChange}
            />
          </>
        ) : (
          'Необходимо выбрать сотрудников для разблокировки'
        )}
      </DialogContent>

      {unlockIDiDDbArray.length > 0 && (
        <DialogActions>
          <LoadingButton
            onClick={handleConfirm}
            variant="contained"
            color="success"
            size="large"
            loading={loading}
          >
            Да
          </LoadingButton>
          <Button
            autoFocus
            onClick={handleCloseSubmitUnlock}
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
