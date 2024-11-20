import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import React from 'react';

interface ReloadButtonProps {
  reloadPage: () => void;
}


export const ReloadButton: React.FC<ReloadButtonProps> = ({ reloadPage }) => {
  return (
    <Button
      onClick={reloadPage}
      variant='contained'
      data-testid='reloadButton'
      sx={{
        color: 'white',
        maxWidth: 40,
        minWidth: 40,
        maxHeight: 40,
        backgroundColor: '#42a5f6',
        '&:hover': {
          backgroundColor: '#0088D1',
          maxWidth: 30,
          minWidth: 40,
          maxHeight: 40,
        },
      }}
    >
      <CachedIcon sx={{ m: 0, fontSize: 30 }} />
    </Button>
  );
};
