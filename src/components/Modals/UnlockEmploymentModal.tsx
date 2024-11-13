import { getFioUnlockIDsArr } from '../../helpers/getInfoOfSelectedUsers';
import {
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { transformDate } from '../../helpers/datesRanges';
import { useRange } from '../../store/dataStore';
import React from 'react';
import { GridApi } from 'ag-grid-community';

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

  const selectedRows = gridApi.getSelectedRows();

  const unlockIDiDDbArray = getFioUnlockIDsArr(selectedRows);

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
    <div style={submitStyle as React.CSSProperties}>
      <DialogTitle
        sx={{
          mr: 5,
          p: 2,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#0088D1',
        }}
      >
        {unlockIDiDDbArray.length > 0
          ? 'Массовая разблокировка занятости'
          : 'Выберите сотрудников!'}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseSubmitUnlock}
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
        {unlockIDiDDbArray.length > 0 ? (
          <>
            <Typography gutterBottom fontSize={18}>
              Вы хотите разблокировать занятость сотрудникам:
            </Typography>
            <Typography gutterBottom fontSize={16} fontWeight={'bold'}>
              {unlockIDiDDbArray.map((fio, index, array) => (
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
