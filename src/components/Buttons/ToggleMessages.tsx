import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Button } from '@mui/material';
import { useGGridStore, useRange } from '../../store/dataStore';
import React from 'react';

export const ToggleMessages = () => {
  const { isMessageColumnVisible, setMessageColumnVisible } = useRange();
  const { ggridRef } = useGGridStore();
  const toggleMessageColumnVisibility = () => {
    const columnDefs = ggridRef.getColumnDefs();
    const showMessage = columnDefs.find(
      (item: { colId: string; }) => item.colId === 'messageColumn',
    );

    if (showMessage.hide === true) {
      showMessage.hide = false;
      showMessage.pinned = 'right';
      setMessageColumnVisible(true);
    } else {
      showMessage.hide = true;
      setMessageColumnVisible(false);
    }

    ggridRef.setColumnDefs(columnDefs);
    ggridRef.sizeColumnsToFit();
  };
  return (
    <Button
      onClick={toggleMessageColumnVisibility}
      variant="text"
      color="primary"
      sx={{
        color: isMessageColumnVisible ? 'white' : '#0088D1',
        '&:hover': {
          backgroundColor: isMessageColumnVisible ? '' : '#0088D1',
          color: isMessageColumnVisible ? '#0088D1' : 'white',
        },
        maxWidth: 30,
        minWidth: 40,
        maxHeight: 40,
        backgroundColor: isMessageColumnVisible ? '#42a5f6' : 'transparent',
        marginLeft: 'auto',
        marginTop: 1,
        marginRight: 2,
      }}
    >
      <MailOutlineIcon sx={{ m: 0, fontSize: 30 }} />
    </Button>
  );
};
