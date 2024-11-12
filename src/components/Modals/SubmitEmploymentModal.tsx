import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
// import { transformDate } from '../../helpers/datesRanges';
import { GridApi } from 'ag-grid-community';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getFioApproveIDsArr } from '../../helpers/getInfoOfSelectedUsers';
import { useRange } from '../../store/dataStore';
import filterSelectedRowsByDates from '../../helpers/filterSelectedRowsByDates';

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

interface EmployeeData {
  "ФИО": string;
  [date: string]: string;
}

export const SubmitEmploymentModal: React.FC<SubmitEmploymentModalProps> = ({
  gridApi,
  handleAction,
  handleCloseSubmit,
  loading,
}: any) => {
  const { startDate, endDate } = useRange();
   // Состояние для чекбоксов
  const [checkedDates, setCheckedDates] = useState<{ [key: string]: boolean }>({});

  const selectedRows: EmployeeData[] = gridApi.getSelectedRows();

  const delIDiDDbArray = getFioApproveIDsArr(filterSelectedRowsByDates(selectedRows, checkedDates));

  // Функция для получения массива дат между startDate и endDate
  const getDatesInRange = (start: Date, end: Date) => {
    const date = new Date(start);
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

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
    const selectedDates = datesArray.filter((date) => checkedDates[date.toISOString()]);
    console.log("🚀 ~ handleConfirm ~ selectedDates:", selectedDates)
    // Преобразуем даты в нужный формат или выполняем необходимое действие
    await handleAction('approve', delIDiDDbArray);
    handleCloseSubmit();
  };

  return (
    <div>
      <DialogTitle
        sx={{
          mr: 5,
          p: 2,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2E7D31',
        }}
      >
        {delIDiDDbArray.length > 0
          ? 'Массовое согласование занятости'
          : 'Выберите сотрудников!'}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseSubmit}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ fontSize: 18, maxWidth: 'md' }}>
        {delIDiDDbArray.length > 0 ? (
          <>
            <Typography gutterBottom fontSize={18}>
              Вы хотите согласовать занятость сотрудникам:
            </Typography>
            <Typography gutterBottom fontSize={16} fontWeight={'bold'}>
              {delIDiDDbArray.map((fio: {}, index: number, array: string | any[]) => (
                <span key={Object.keys(fio)[0]}>
                  {Object.keys(fio)}
                  {index < array.length - 1 && ', '}
                </span>
              ))}
            </Typography>
            <Typography gutterBottom fontSize={18}>
              Выберите дни для согласования:
            </Typography>
            <FormGroup row sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {datesArray.map((date) => {
                const dateKey = date.toISOString();
                // Используем двухбуквенные сокращения дней недели
                const dayOfWeek = format(date, 'EEEEEE', { locale: ru });
                const dayAndMonth = format(date, 'dd');
                return (
                  <FormControlLabel
                    key={dateKey}
                    control={
                      <Checkbox
                        checked={checkedDates[dateKey] || false}
                        onChange={() => handleCheckboxChange(dateKey)}
                        sx={{
                          paddingRight: '1px',
                        }}
                      />
                    }
                    label={`${dayOfWeek} ${dayAndMonth}`}
                    sx={{
                      marginRight: 1, // Уменьшаем отступ между чекбоксами
                      '.MuiFormControlLabel-label': {
                        fontSize: '0.85rem', // Уменьшаем размер шрифта, если нужно
                        marginLeft: '4px', // Уменьшаем отступ между чекбоксом и текстом
                      },
                      marginLeft: 0,
                    }}
                  />
                );
              })}
            </FormGroup>
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
