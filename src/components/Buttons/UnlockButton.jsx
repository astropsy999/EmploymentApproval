import { Button } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export const UnlockButton = ({ handleOpenModalSubmitUnlocking }) => {
  return (
    <Button
      sx={{
        '&:hover': {
          boxShadow:
            'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
        },
      }}
      variant="outlined"
      color="info"
      startIcon={<LockOpenIcon />}
      onClick={handleOpenModalSubmitUnlocking}
    >
      Разблокировать
    </Button>
  );
};
