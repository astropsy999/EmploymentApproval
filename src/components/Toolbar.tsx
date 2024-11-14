import { Stack } from '@mui/material';
import React from 'react';
import { DatePicker } from '../helpers/datePicker';
import { ApproveButton } from './Buttons/ApproveButton';
import { LockButton } from './Buttons/LockButton';
import { ReloadButton } from './Buttons/ReloadButton';
import { UnlockButton } from './Buttons/UnlockButton';

interface ToolbarProps {
  handleOpenModalSubmit: () => void;
  handleOpenModalSubmitLocking: () => void;
  handleOpenModalSubmitUnlocking: () => void;
  reloadPage: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  handleOpenModalSubmit,
  handleOpenModalSubmitLocking,
  handleOpenModalSubmitUnlocking,
  reloadPage,
}) => {
  return (
    <Stack direction="row" spacing={1} sx={{ m: 1, height: 40 }}>
      <DatePicker />
      <ApproveButton handleOpenModalSubmit={handleOpenModalSubmit} />
      <LockButton handleOpenModalSubmitLocking={handleOpenModalSubmitLocking} />
      <UnlockButton handleOpenModalSubmitUnlocking={handleOpenModalSubmitUnlocking} />
      <ReloadButton reloadPage={reloadPage} />
    </Stack>
  );
};

export default Toolbar;
