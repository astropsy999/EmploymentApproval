import React, { useCallback } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { BsPin } from 'react-icons/bs';
import { useState } from 'react';
import { memo } from 'react';
import { Button } from '@mui/material';

interface CustomHeaderRendererProps {
  columnApi: any; // replace 'any' with the actual type of columnApi
}

const CustomHeaderRenderer = memo((props: CustomHeaderRendererProps) => {
  const { columnApi } = props;
  const [isPinned, setIsPinned] = useState(false);
  const [icon, setIcon] = useState(<FaThumbtack />);

  const togglePin = () => {
    const newPinnedState = !isPinned;
    columnApi.setColumnPinned('messageColumn', newPinnedState ? 'right' : null);
    setIsPinned((prevState) => !prevState);
    setIcon((prevIcon) => (!isPinned ? <FaThumbtack /> : <BsPin />));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button onClick={togglePin} sx={{ minWidth: 20 }}>
        {icon}
      </Button>
      <div>{props.displayName}</div>
    </div>
  );
});

export default CustomHeaderRenderer;
