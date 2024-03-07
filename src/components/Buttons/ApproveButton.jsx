import FactCheckIcon from '@mui/icons-material/FactCheck';
import { Button } from '@mui/material';

export const ApproveButton = ({ handleOpenModalSubmit }) => {
  return (
    <Button
      sx={{
        '&:hover': {
          boxShadow:
            'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
        },
      }}
      variant="outlined"
      color="success"
      startIcon={<FactCheckIcon />}
      onClick={handleOpenModalSubmit}
    >
      Согласовать
    </Button>
  );
};
