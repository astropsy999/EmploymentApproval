import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

export const ReloadButton = ({ reloadPage }) => {
  return (
    <Button
      onClick={reloadPage}
      variant="filled"
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
