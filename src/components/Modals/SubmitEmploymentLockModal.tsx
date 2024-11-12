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
import { transformDate } from '../../helpers/datesRanges';
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


/**
 * Интерфейс для данных сотрудника.
 */
interface EmployeeData {
  "ФИО": string;
  [date: string]: string;
}

/**
 * Интерфейс для массива данных с ФИО и соответствующими ID.
 */
interface FioIdsArray {
  [fio: string]: string[];
}

/**
 * Интерфейс для пропсов компонента SubmitEmploymentLockModal.
 */
interface SubmitEmploymentLockModalProps {
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

export const SubmitEmploymentLockModal: React.FC<SubmitEmploymentLockModalProps> = ({
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
  const selectedRows = gridApi.getSelectedRows();

  const lockIDiDDbArray = getFioLockIDsArr(selectedRows);
  const delIDiDDbArray = getFioApproveIDsArr(selectedRows);

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
      <DialogTitle
        sx={{
          mr: 5,
          p: 2,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#ed6d02',
        }}
      >
        {lockIDiDDbArray.length > 0
          ? 'Массовая блокировка занятости'
          : 'Выберите сотрудников!'}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseSubmitLock}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
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
            <Typography gutterBottom fontSize={18} color={'#2d79e6'}>
              в период с <b>{transformDate(startDate)}</b> по{' '}
              <b>{transformDate(endDate)}</b>?
            </Typography>
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
