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
import { getFioApproveIDsArr } from '../../helpers/getInfoOfSelectedUsers';

export const SubmitEmploymentModal = ({
  gridApi,
  handleAction,
  handleCloseSubmit,
  loading,
}) => {
  const { startDate, endDate } = useRange();

  const selectedRows = gridApi.getSelectedRows();

  const delIDiDDbArray = getFioApproveIDsArr(selectedRows);

  const handleConfirm = async () => {
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
      <DialogContent dividers sx={{ fontSize: 18, maxWidth: 'sm' }}>
        {delIDiDDbArray.length > 0 ? (
          <>
            <Typography gutterBottom fontSize={18}>
              Вы хотите согласовать занятость сотрудникам:
            </Typography>
            <Typography gutterBottom fontSize={16} fontWeight={'bold'}>
              {delIDiDDbArray.map((fio, index, array) => (
                <span key={Object.keys(fio)}>
                  {Object.keys(fio)}
                  {index < array.length - 1 && ', '}
                </span>
              ))}
            </Typography>
            <Typography gutterBottom fontSize={18} color={'#2d79e6'}>
              в период с <b> {transformDate(startDate)}</b> по{' '}
              <b>{transformDate(endDate)}</b>?
            </Typography>
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
