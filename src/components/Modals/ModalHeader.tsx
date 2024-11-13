// src/components/Modals/Header.tsx

import React from 'react';
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ModalHeaderProps } from '../../types';


/**
 * Компонент ModalHeader для модальных окон.
 *
 * @param title - Заголовок модального окна.
 * @param onClose - Функция закрытия модального окна.
 * @param color - Цвет заголовка.
 * @returns JSX.Element
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, color }) => {
  return (
    <DialogTitle
      sx={{
        mr: 5,
        p: 2,
        fontSize: 20,
        fontWeight: 'bold',
        color: color,
      }}
    >
      {title}
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
    </DialogTitle>
  );
};

export default ModalHeader;
