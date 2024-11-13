import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { GridApi } from 'ag-grid-community';
import { getDatesInRange } from '../../helpers/datesRanges';
import filterSelectedRowsByDates from '../../helpers/filterSelectedRowsByDates';
import { getFioApproveIDsArr } from '../../helpers/getInfoOfSelectedUsers';
import { useRange } from '../../store/dataStore';
import { EmployeeData } from '../../types';
import DateCheckboxGroup from '../DateCheckboxGroup';
import ModalHeader from '../ModalHeader';

interface SubmitEmploymentModalProps {
  gridApi: GridApi;
  handleAction: (
    actionType: string,
    dataArray: any[],
    selectedDates: Date[]
  ) => Promise<void>;
  handleCloseSubmit: () => void;
  loading: boolean;
}

export const SubmitEmploymentModal: React.FC<SubmitEmploymentModalProps> = ({
  gridApi,
  handleAction,
  handleCloseSubmit,
  loading,
}: any) => {
  const { startDate, endDate } = useRange();
  const [checkedDates, setCheckedDates] = useState<{ [key: string]: boolean }>({});

  const selectedRows: EmployeeData[] = gridApi.getSelectedRows();

  const delIDiDDbArray = getFioApproveIDsArr(filterSelectedRowsByDates(selectedRows, checkedDates));

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
    // Фильтруем выбранные даты
    // const selectedDates = datesArray.filter((date) => checkedDates[date.toISOString()]);
    await handleAction('approve', delIDiDDbArray);
    handleCloseSubmit();
  };

  return (
    <div>
      {delIDiDDbArray.length > 0 ? (
        <ModalHeader
          title={'Массовое согласование занятости'}
          onClose={handleCloseSubmit}
          color={'#2E7D31'}
        />
      ): (
        <ModalHeader
          title={'Выберите сотрудников!'}
          onClose={handleCloseSubmit}
          color={'#2E7D31'}
        />
      )}
      <DialogContent dividers sx={{ fontSize: 18, maxWidth: 'md' }}>
        {delIDiDDbArray.length > 0 ? (
          <>
            <Typography gutterBottom fontSize={18}>
              Вы хотите согласовать занятость сотрудникам:
            </Typography>
            <Typography gutterBottom fontSize={16} fontWeight={'bold'}>
              {delIDiDDbArray.map(
                (fio: {}, index: number, array: string | any[]) => (
                  <span key={Object.keys(fio)[0]}>
                    {Object.keys(fio)}
                    {index < array.length - 1 && ', '}
                  </span>
                ),
              )}
            </Typography>
            <Typography gutterBottom fontSize={18}>
              Выберите дни для согласования:
            </Typography>
            <DateCheckboxGroup
              dates={datesArray}
              checkedDates={checkedDates}
              onChange={handleCheckboxChange}
            />
          </>
        ) : (
          'Необходимо выбрать сотрудников для согласования'
        )}
      </DialogContent>

      {delIDiDDbArray.length > 0 && (
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
            onClick={handleCloseSubmit}
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
