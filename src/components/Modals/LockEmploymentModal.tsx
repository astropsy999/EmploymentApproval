import {
  getFioApproveIDsArr,
  getFioLockIDsArr,
} from '../../helpers/getInfoOfSelectedUsers';
import {
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Button,
  Container,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { getDatesInRange, transformDate } from '../../helpers/datesRanges';
import { useRange } from '../../store/dataStore';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Popover from '@mui/material/Popover';
import { useEffect } from 'react';
import {
  multiApproveEmployment,
  multiLockEmloyment,
  getUsersForManagers,
} from '../../data/api';
import React from 'react';
import { GridApi } from 'ag-grid-community';
import { customLoader } from '../../helpers/customLoader';
import DateCheckboxGroup from '../DateCheckboxGroup';
import filterSelectedRowsByDates from '../../helpers/filterSelectedRowsByDates';
import { EmployeeData, FioIdsArray } from '../../types';
import ModalHeader from './ModalHeader';



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
  const { startDate, endDate } = useRange();
  const selectedRows: EmployeeData[] = gridApi.getSelectedRows();

  const [checkedDates, setCheckedDates] = React.useState<{
    [key: string]: boolean;
  }>({});

  const lockIDiDDbArray = getFioLockIDsArr(
    filterSelectedRowsByDates(selectedRows, checkedDates),
  );
  console.log('🚀 ~ lockIDiDDbArray:', lockIDiDDbArray);
  const delIDiDDbArray = getFioApproveIDsArr(
    filterSelectedRowsByDates(selectedRows, checkedDates),
  );
  console.log('🚀 ~ delIDiDDbArray:', delIDiDDbArray);

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
            <Typography gutterBottom fontSize={18}>
              Вы хотите заблокировать занятость сотрудникам:
            </Typography>
            <Typography gutterBottom fontSize={16} fontWeight={'bold'}>
              {lockIDiDDbArray.map((fio, index, array) => (
                <span key={Object.keys(fio)[0]}>
                  {Object.keys(fio)}
                  {index < array.length - 1 && ', '}
                </span>
              ))}
            </Typography>
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
            <PopupState variant="popover">
              {(popupState) => (
                <>
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="success"
                    size="large"
                    //@ts-ignore
                    onClick={handleConfirm}
                    {...bindTrigger(popupState)}
                  >
                    Да
                  </LoadingButton>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Container maxWidth="xs">
                      <Typography variant="h5" mt={2}>
                        Вы хотите заблокировать неделю сотрудникам, но у
                        некоторых внесена фактическая занятость.
                        <br />
                        <b>Согласуете перед блокировкой?</b>
                      </Typography>
                      <Stack direction={'row'} spacing={1} sx={{ p: 2, m: 1 }}>
                        <LoadingButton
                          onClick={handleConfirmSubmitLock}
                          loading={loading}
                          variant="contained"
                          color="success"
                          size="large"
                        >
                          Да
                        </LoadingButton>
                        <LoadingButton
                          onClick={handleConfirm}
                          loading={loading}
                          variant="contained"
                          color="success"
                          size="large"
                        >
                          Нет
                        </LoadingButton>
                        <Button
                          autoFocus
                          onClick={handleCloseSubmitLock}
                          variant="contained"
                          color="error"
                          size="large"
                        >
                          Отмена
                        </Button>
                      </Stack>
                    </Container>
                  </Popover>
                </>
              )}
            </PopupState>
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
