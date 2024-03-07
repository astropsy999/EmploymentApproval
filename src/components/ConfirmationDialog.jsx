import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Да</Button>
        <Button autoFocus onClick={onClose}>
          Нет
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
