import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import React from 'react';

type LockButtonProps = {
  handleOpenModalSubmitLocking: () => void;
}

export const LockButton: React.FC<LockButtonProps> = ({ handleOpenModalSubmitLocking }) => {
  return (
    <Button
      sx={{
        '&:hover': {
          boxShadow:
            'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
        },
      }}
      variant="outlined"
      color="warning"
      startIcon={<LockIcon />}
      onClick={handleOpenModalSubmitLocking}
    >
      Заблокировать
    </Button>
  );
};
